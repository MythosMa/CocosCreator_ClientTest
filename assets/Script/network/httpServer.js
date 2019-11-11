export default {
    request: (obj) => {
        let httpRequest = new XMLHttpRequest();
        let time = 5 * 1000;
        let timeout = false;

        //超时
        let timer = setTimeout(() => {
            timeout = true;
            httpRequest.abort();
        }, time);

        let url = obj.url;

        //请求参数
        if(typeof obj.data === 'object') {
            let kvs = [];
            for(let k in obj.data) {
                kvs.push(encodeURIComponent(k) + '=' + encodeURIComponent(obj.data[k]));
            }
            url += '?';
            url += kvs.join('&');
        }

        httpRequest.open(obj.method ? obj.method : 'GET', url ,true);

        httpRequest.onreadystatechange = () => {
            let response = httpRequest.responseText;
            clearTimeout(timer);

            if(httpRequest.readyState === 4) {
                if(typeof obj.success === 'function') {
                    let resJson = JSON.parse(response);
                    obj.success(resJson);
                }
            }else {
                if(typeof obj.fail === 'function') {
                    obj.fail(response);
                }
            }
        };

        httpRequest.send();
    }
}
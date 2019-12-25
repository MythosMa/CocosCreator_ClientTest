class Tools {
    constructor() {
        this.webSocketServerUrl = "ws://127.0.0.1";
        this.chatPort = "8183";
        this.testMapPort = "8184";
    }

    getChatServerUrl() {
        return this.webSocketServerUrl + ":" + this.chatPort;
    }

    getTestMapServerUrl() {
        return this.webSocketServerUrl + ":" + this.testMapPort;
    }

    //计算弧度
    getRadian(point) {
        let radian = Math.atan2(point.y, point.x) ;
        return radian ;
    }
    
    //计算两点间距离
    getDistance(pos1, pos2) {
        let x = pos1.x - pos2.x ;
        let y = pos1.y - pos2.y ;
        return Math.sqrt(x * x + y * y) ;
    }

}

export default new Tools() ;
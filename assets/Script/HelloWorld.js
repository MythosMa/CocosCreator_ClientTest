// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html
import http from './network/httpServer';

cc.Class({
    extends: cc.Component,

    properties: {
        subButton: {
            default: null,
            type: cc.Button
        },

        tipLabel: {
            default: null,
            type: cc.Label
        },

        input: {
            default: null,
            type: cc.EditBox
        }
    },

    onLoad() {

    },

    //发送请求的方法
    httpRequest() {
        let obj = {
            url : 'http://127.0.0.1:8181',
            data:{
                input: this.input.string
            },
            success : (res) => {
                this.tipLabel.string = res.info;
            },
            fail: (res) => {
                console.log("fail!");
                console.log(res);
            }
        }
        http.request(obj);
    },


    start () {

    },
});

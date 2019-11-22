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
        subButtonHttp: {
            default: null,
            type: cc.Button
        },
        subButtonWS: {
            default: null,
            type: cc.Button
        },
        subButtonWSGame: {
            default: null,
            type: cc.Button
        },
        tipLabel: {
            default: null,
            type: cc.Label
        },
        tipLabelWS: {
            default: null,
            type: cc.Label
        },
        tipLabelWSGame: {
            default: null,
            type: cc.Label
        },
        input: {
            default: null,
            type: cc.EditBox
        }
    },

    onLoad() {
        this.gameWS = new WebSocket('ws://127.0.0.1:8183');
        //开启websocket
        this.chatWS.onopen = (event) => {
            console.log("chatWS onopen========");
            console.log(event);
            console.log("chatWS onopen========");
        }
        this.gameWS.onopen = (event) => {
            console.log("gameWS onopen========");
            console.log(event);
            console.log("gameWS onopen========");
        }

        let that = this;
        //接受websocket的数据
        this.chatWS.onmessage = (event) => {
            console.log("chatWS onmessage========");
            console.log(event);
            console.log("chatWS onmessage========");
            that.tipLabelWS.string = event.data;
        }
        this.gameWS.onmessage = (event) => {
            console.log("gameWS onmessage========");
            console.log(event);
            console.log("gameWS onmessage========");
            that.tipLabelWSGame.string = event.data;
        }
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

    wsRequest() {
        if(this.chatWS.readyState === WebSocket.OPEN) {
            this.chatWS.send(this.input.string);
        }
    },

    wsgRequest() {
        if(this.gameWS.readyState === WebSocket.OPEN) {
            this.gameWS.send(this.input.string);
        }
    },

    start () {

    },
});

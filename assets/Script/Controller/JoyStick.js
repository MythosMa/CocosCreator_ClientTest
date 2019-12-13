// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

import Tools from "../Common/Tools";

cc.Class({
    extends: cc.Component,

    properties: {
        joyStickBG: {
            type: cc.Node,
            default: null
        },
        joyStickBar: {
            type: cc.Node,
            default: null
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        //初始化时候，隐藏摇杆
        this.joyStickBG.active = false ;
        this.joyStickBar.active = false ;

        //初始化摇杆触摸状态，以及摇杆初始坐标，和摇杆与摇杆中心距离。
        this._joyStart = false ;
        this._joyStartPos = null ;
        this._radian = -100 ;

        //给这个节点添加触摸事件，此为触摸屏幕开始
        this.node.on(
            'touchstart', 
            (event) => {
                //激活摇杆操作，并显示摇杆和背景
                this._joyStart = true ;
                this.joyStickBG.active = true ;
                this.joyStickBar.active = true ;

                //根据触屏位置，设置摇杆位置
                this._joyStartPos = this.node.convertToNodeSpaceAR(event.getLocation()) ;
                this.joyStickBG.setPosition(this._joyStartPos) ;
                this.joyStickBar.setPosition(this._joyStartPos) ;
            }
        ) ;

        //给这个节点添加触摸事件，此为鼠标点击屏幕开始
        this.node.on(
            'mousedown', (event) => {
                this._joyStart = true ;
                this.joyStickBG.active = true ;
                this.joyStickBar.active = true ;


                this._joyStartPos = this.node.convertToNodeSpaceAR(event.getLocation()) ;
                this.joyStickBG.setPosition(this._joyStartPos) ;
                this.joyStickBar.setPosition(this._joyStartPos) ;
            }
        ) ;

        //手指在屏幕移动的监听
        this.node.on('touchmove', (event) => {
            if(this._joyStart) {

                //将手指触摸到界面的坐标，转换到摇杆背景上，用来计算摇杆的移动位置
                let pos = this.joyStickBG.convertToNodeSpaceAR(event.getLocation()) ;
                let radian = this._radian = Tools.getRadian(pos) ;
                
                //将摇杆和背景中心点，最远距离设为50像素，这样手指移动的较远的话，摇杆也不会超出摇杆背景
                if(Tools.getDistance(cc.v2(0, 0), pos) <= 50) {
                    pos.x += this._joyStartPos.x ;
                    pos.y += this._joyStartPos.y ;
                    
                }else {
                    //手指超出摇杆背景了，就需要用三角函数来计算对应的没有超出背景的坐标，来设置摇杆的位置
                    pos.x = this._joyStartPos.x + Math.cos(radian) * 50 ;
                    pos.y = this._joyStartPos.y + Math.sin(radian) * 50 ;
                }
                this.joyStickBar.setPosition(pos) ;
            }
        }) ;

        //监听鼠标用的
        this.node.on('mousemove', (event) => {
            if(this._joyStart) {
                
                let pos = this.joyStickBG.convertToNodeSpaceAR(event.getLocation()) ;
                let radian = this._radian = Tools.getRadian(pos) ;

                //console.log('mouse radian : ' + radian) ;
                
                if(Tools.getDistance(cc.v2(0, 0), pos) <= 50) {
                    pos.x += this._joyStartPos.x ;
                    pos.y += this._joyStartPos.y ;
                    
                }else {
                    pos.x = this._joyStartPos.x + Math.cos(radian) * 50 ;
                    pos.y = this._joyStartPos.y + Math.sin(radian) * 50 ;
                }
                this.joyStickBar.setPosition(pos) ;
            }
        }) ;

        //离开屏幕，隐藏摇杆并设置初始值。
        this.node.on('touchend', (event) => {
            if(this._joyStart) {
                this._joyStart = false ;
                this.joyStickBG.active = false ;
                this.joyStickBar.active = false ;

                this._radian = -100 ;
            }
        }) ;

        this.node.on('mouseup', (event) => {
            if(this._joyStart) {
                this._joyStart = false ;
                this.joyStickBG.active = false ;
                this.joyStickBar.active = false ;

                this._radian = -100 ;
            }
        }) ;

        //手指滑动超出了摇杆的控制区域，视同手指离开屏幕
        this.node.on('touchcancel', (event) => {
            if(this._joyStart) {
                this._joyStart = false ;
                this.joyStickBG.active = false ;
                this.joyStickBar.active = false ;

                this._radian = -100 ;
            }
        }) ;

        this.node.on('mouseleave', (event) => {
            if(this._joyStart) {
                this._joyStart = false ;
                this.joyStickBG.active = false ;
                this.joyStickBar.active = false ;

                this._radian = -100 ;
            }
        }) ;
    },

    start () {

    },

    // update (dt) {},
});

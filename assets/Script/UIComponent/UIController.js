// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
  extends: cc.Component,

  properties: {
    isShowChatLayout: false,
    chatLayout: {
      type: cc.Node,
      default: null
    },
    chatLayoutControlBtnLabel: {
      type: cc.Label,
      default: null
    }
  },

  // LIFE-CYCLE CALLBACKS:

  onLoad() {
    //手指在屏幕移动的监听
    // this.node.on("touchstart", event => {
    //     event.stopPropagation();
    // });

    // //监听鼠标用的
    // this.node.on("mousedown", event => {
    //     event.stopPropagation();
    // });
  },

  start() {},

  chatLayoutControlBtn() {
    if (this.isShowChatLayout) {
      let move = cc.moveBy(0.5, cc.v2(-this.chatLayout.width, 0));
      this.chatLayout.runAction(move);
      this.chatLayoutControlBtnLabel.string = "显";
    } else {
      let move = cc.moveBy(0.5, cc.v2(this.chatLayout.width, 0));
      this.chatLayout.runAction(move);
      this.chatLayoutControlBtnLabel.string = "隐";
    }
    this.isShowChatLayout = !this.isShowChatLayout;
  }

  // update (dt) {},
});

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
    ske: {
      default: null,
      type: cc.Node,
    },
    nameLabel: {
      default: null,
      type: cc.Label,
    },
  },

  onLoad() {
    //和服务器一样，角色的三个状态
    this.State = cc.Enum({
      STATE_STAND: 1,
      STATE_WALK_LEFT: -1,
      STATE_WALK_RIGHT: -1,
    });
    this.playerData = null;
    this.currentState = this.State.STATE_STAND;
    this.animDisplay = null;
  },

  //获取角色信息
  getPlayerData() {
    return this.playerData;
  },

  //创建时，初始化角色信息
  initCharacter(data) {
    this.playerData = data;
    this.animDisplay = this.ske.getComponent(dragonBones.ArmatureDisplay);
    this.nameLabel.getComponent(cc.Label).string = data.playerName;
    let playerAttribute = data.playerAttribute;
    this.node.setPosition(
      cc.v2(playerAttribute.position.x, playerAttribute.position.y)
    );
  },

  //服务器发送过来角色数据，在这里更新
  refreshPlayerData(playerData) {
    let playerAttribute = playerData.playerAttribute;
    this.resetState(playerAttribute.currentState);
    this.node.setPosition(
      cc.v2(playerAttribute.position.x, playerAttribute.position.y)
    );
    this.ske.setScale(playerAttribute.scale.x, playerAttribute.scale.y);
  },

  //根据状态切换角色动画，注意，这里切换动画的的骨骼名称、动画名称都是在龙骨编辑器里定义好的
  resetState(state) {
    if (this.currentState === state) {
      return;
    }
    switch (state) {
      case this.State.STATE_STAND:
        this.changeAnimation("SakuyaStand", "SakuyaStand", 0);
        break;
      case this.State.STATE_WALK_LEFT:
        this.changeAnimation("SakuyaWalkFront", "SakuyaWalkFront", 0);

        break;
      case this.State.STATE_WALK_RIGHT:
        this.changeAnimation("SakuyaWalkFront", "SakuyaWalkFront", 0);
        break;
    }
    this.currentState = state;
  },

  //切换动画
  changeAnimation(armatureName, animationName, playTimes, callbacks) {
    if (
      this.animDisplay.armatureName === armatureName &&
      this.animDisplay.animationName === animationName
    ) {
      return;
    }

    if (this.animDisplay.armatureName !== armatureName) {
      this.animDisplay.armatureName = armatureName;
    }

    this.animDisplay.playAnimation(animationName, playTimes);
  },

  //将角色从界面中移除
  deleteCharacter() {
    this.node.removeFromParent(true);
  },
});

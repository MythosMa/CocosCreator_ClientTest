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

  properties: {},

  // LIFE-CYCLE CALLBACKS:

  onLoad() {
    this.State = cc.Enum({
      STATE_STAND: 1,
      STATE_WALK_LEFT: -1,
      STATE_WALK_RIGHT: -1
    });
    this.playerData = null;
    this.currentState = this.State.STATE_STAND;
    this.animDisplay = null;
  },

  getPlayerData() {
    return this.playerData;
  },

  initCharactor(data) {
    this.playerData = data;
    let playerAttribute = data.playerAttribute;
    this.animDisplay = this.getComponent(dragonBones.ArmatureDisplay);
    this.node.setPosition(
      cc.v2(playerAttribute.position.x, playerAttribute.position.y)
    );
  },

  refreshPlayerData(playerData) {
    let playerAttribute = playerData.playerAttribute;
    this.resetState(playerAttribute.currentState);
    this.node.setPosition(
      cc.v2(playerAttribute.position.x, playerAttribute.position.y)
    );
    this.node.setScale(playerAttribute.scale.x, playerAttribute.scale.y);
  },

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

  deleteCharactor() {
    this.node.removeFromParent(true);
  }
});

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
    joyStick: {
      default: null,
      type: cc.Node
    },
    playerCharactorPrefab: {
      default: null,
      type: cc.Prefab
    }
  },

  // LIFE-CYCLE CALLBACKS:

  onLoad() {
    this.joyStickController = this.joyStick.getComponent("JoyStick");

    this.State = cc.Enum({
      STATE_STAND: 1,
      STATE_WALK_LEFT: -1,
      STATE_WALK_RIGHT: -1
    });
    this.currentState = this.State.STATE_STAND;
    this.charactor = null;
    this.playerData = null;
    this.wsServer = null;
  },

  start() {},

  initCharactor(data, wsServer) {
    this.wsServer = wsServer;
    this.playerData = data;
    this.charactor = cc.instantiate(this.playerCharactorPrefab);
    this.node.addChild(this.charactor);
    this.charactor.getComponent("Charactor").initCharactor(data);
    this.sendDataToServer("PLAYER_CLIENT_INIT_OVER", null);
  },

  getPlayerData() {
      return this.playerData;
  },

  update(dt) {
    if (!this.playerData) {
      return;
    }
    let radian = this.joyStickController._radian;
    if (radian != -100) {
      if (-0.5 <= radian && radian <= 0.5) {
        this.changeState(this.State.STATE_WALK_RIGHT);
      } else if (
        (2.5 <= radian && radian <= Math.PI) ||
        (-1 * Math.PI <= radian && radian <= -2.5)
      ) {
        this.changeState(this.State.STATE_WALK_LEFT);
      } else {
        this.changeState(this.State.STATE_STAND);
      }
    } else {
      this.changeState(this.State.STATE_STAND);
    }
  },

  changeState(state) {
    if(this.currentState === state) {
        return ;
    }
    this.sendDataToServer("PLAYER_OPERATION", {state: state});
  },

  refreshPlayerData(playerData) {
    this.charactor.getComponent("Charactor").refreshPlayerData(playerData);
    this.currentState = playerData.playerAttribute.state;
  },

  sendDataToServer(dataType, data) {
    if (this.wsServer.readyState === WebSocket.OPEN) {
      let wsServerData = {
        dataType,
        data
      };
      this.wsServer.send(JSON.stringify(wsServerData));
    }
  }
});

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
    //将摇杆绑定到Player，记得在编辑器中将对应模块拖入哦
    joyStick: {
      default: null,
      type: cc.Node
    },
    //角色动画的预制体，记得在编辑器中将对应模块拖入哦
    playerCharacterPrefab: {
      default: null,
      type: cc.Prefab
    }
  },

  // LIFE-CYCLE CALLBACKS:

  onLoad() {
    //获得摇杆
    this.joyStickController = this.joyStick.getComponent("JoyStick");

    //同样在Player里面添加一下状态管理，避免在状态未改变时频繁像服务器发送操作指令
    this.State = cc.Enum({
      STATE_STAND: 1,
      STATE_WALK_LEFT: -1,
      STATE_WALK_RIGHT: -1
    });
    this.currentState = this.State.STATE_STAND;
    this.character = null;
    this.playerData = null;
    this.wsServer = null;
  },

  start() {},

  //服务器通知客户端初始化玩家角色时，通过服务器返回的角色数据，用预制体创建Character角色并放入到场景中，同时发送创建完成消息给服务器
  initCharacter(data, wsServer) {
    this.wsServer = wsServer;
    this.playerData = data;
    this.character = cc.instantiate(this.playerCharacterPrefab);
    this.node.addChild(this.character);
    this.character.getComponent("Character").initCharacter(data);
    this.sendDataToServer("PLAYER_CLIENT_INIT_OVER", null);
  },
  
  //获取玩家控制的角色信息
  getPlayerData() {
      return this.playerData;
  },

  //这个循环是用来监听摇杆状态的，当摇杆达到操作要求后，改变角色状态并发送到服务器
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
    //这里就是状态未改变时不要发消息给服务器
    if(this.currentState === state) {
        return ;
    }
    this.sendDataToServer("PLAYER_OPERATION", {state: state});
  },

  //接收到服务器返回的数据，更新角色状态。玩家操纵的角色在这里单独处理，其他客户端玩家控制的角色，可以直接操作Character来处理。
  refreshPlayerData(playerData) {
    this.character.getComponent("Character").refreshPlayerData(playerData);
    this.currentState = playerData.playerAttribute.state;
  },

  //封装一下向服务器发送消息的函数
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

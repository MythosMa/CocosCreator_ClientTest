// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.

import Tools from '../Common/Tools';

cc.Class({
  extends: cc.Component,

  properties: {
      //绑定角色控制，记得在编辑器中将对应模块拖入哦
      player: {
          default: null,
          type: cc.Node
      },
      //绑定预制体，用来创建其他客户端玩家角色数据，记得在编辑器中将对应模块拖入哦
      playerCharacterPrefab: {
        default: null,
        type: cc.Prefab
      },
      //绑定角色们该在的图层，记得在编辑器中将对应模块拖入哦
      playerLayer: {
          default: null,
          type: cc.Node
      }
  },

  // LIFE-CYCLE CALLBACKS:

  onLoad() {
    //非玩家控制角色和npc角色数据合集
    this.otherPlayers = [];
    this.npcs = [];
    //地图的websocket
    this.mapWS = new WebSocket(Tools.getTestMapServerUrl());
    this.mapWS.onmessage = event => {
        let dataObject = JSON.parse(event.data);
        let dataType = dataObject.dataType;
        let data = dataObject.data;

        //连接成功
        if(dataType === "CONNECT_SUCCESS") {
            this.openMap();
        }
        //服务器完成创建后，将角色数据发送给客户端，客户端根据数据创建角色
        if(dataType === "PLAYER_SERVER_INIT_OVER") {
            if(this.player) {
                this.player.getComponent("Player").initCharacter(data, this.mapWS);
            }
        }
        //服务器发送回来的游戏过程中的全部角色数据
        if(dataType === "GAME_PLAYER_DATA") {
            let npcs = data.npcs;
            let players = data.players;

            //npc数据处理，以后拓展
            for(let i in npcs) {
                let npc = npcs[i];
            }

            //玩家角色处理
            for(let i in players) {
                let player = players[i];
                //返回的数据中，如果是玩家操控的角色，单独处理
                if(player.playerId === this.player.getComponent("Player").getPlayerData().playerId) {
                    this.player.getComponent("Player").refreshPlayerData(player);
                    continue;
                }
                //遍历其他角色数据，判断是否是新加入的角色，不是的话，刷新角色数据
                let isNew = true;
                for(let k in this.otherPlayers) {
                    let otherPlayer = this.otherPlayers[k];
                    if(player.playerId === otherPlayer.getComponent("Character").getPlayerData().playerId) {
                        //判断已加入角色是否为退出地图状态，是的话删数据色，不是的话更新角色
                        if(!player.playerAttribute.logout) {
                            otherPlayer.getComponent("Character").refreshPlayerData(player);
                        }else {
                            otherPlayer.getComponent("Character").deleteCharacter();
                            this.otherPlayers.splice(k, 1);
                            k--;
                        }
                        isNew = false;
                        break;
                    }
                }
                //如果是新加入角色，是的话，创建角色并添加到地图中
                if(isNew && !player.playerAttribute.logout) {
                    let otherPlayer = cc.instantiate(this.playerCharacterPrefab);
                    this.playerLayer.addChild(otherPlayer);
                    otherPlayer.getComponent("Character").initCharacter(player);
                    this.otherPlayers.push(otherPlayer);
                }
            }
        }
    };
  },

  start() {

  },

  openMap() {
    if (this.mapWS.readyState === WebSocket.OPEN) {
        let mapWSData =  {
            dataType: "PLAYER_SERVER_INIT",
            data: null
        }
        this.mapWS.send(JSON.stringify(mapWSData));
    }
  },

  // update (dt) {},
});

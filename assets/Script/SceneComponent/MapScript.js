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
      player: {
          default: null,
          type: cc.Node
      },
      playerCharactorPrefab: {
        default: null,
        type: cc.Prefab
      },
      playerLayer: {
          default: null,
          type: cc.Node
      }
  },

  // LIFE-CYCLE CALLBACKS:

  onLoad() {
    this.otherPlayers = [];
    this.npcs = [];
    this.mapWS = new WebSocket(Tools.getTestMapServerUrl());
    this.mapWS.onmessage = event => {
        let dataObject = JSON.parse(event.data);
        let dataType = dataObject.dataType;
        let data = dataObject.data;

        if(dataType === "CONNECT_SUCCESS") {
            this.openMap();
        }
        if(dataType === "PLAYER_SERVER_INIT_OVER") {
            if(this.player) {
                this.player.getComponent("Player").initCharactor(data, this.mapWS);
            }
        }
        if(dataType === "GAME_PLAYER_DATA") {
            let npcs = data.npcs;
            let players = data.players;

            for(let i in npcs) {
                let npc = npcs[i];
            }

            for(let i in players) {
                let player = players[i];
                if(player.playerId === this.player.getComponent("Player").getPlayerData().playerId) {
                    this.player.getComponent("Player").refreshPlayerData(player);
                    continue;
                }
                let isNew = true;
                for(let k in this.otherPlayers) {
                    let otherPlayer = this.otherPlayers[k];
                    if(player.playerId === otherPlayer.getComponent("Charactor").getPlayerData().playerId) {
                        if(!player.playerAttribute.logout) {
                            otherPlayer.getComponent("Charactor").refreshPlayerData(player);
                        }else {
                            otherPlayer.getComponent("Charactor").deleteCharactor();
                            this.otherPlayers.splice(k, 1);
                            k--;
                        }
                        isNew = false;
                        break;
                    }
                }
                if(isNew && !player.playerAttribute.logout) {
                    let otherPlayer = cc.instantiate(this.playerCharactorPrefab);
                    this.playerLayer.addChild(otherPlayer);
                    otherPlayer.getComponent("Charactor").initCharactor(player);
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

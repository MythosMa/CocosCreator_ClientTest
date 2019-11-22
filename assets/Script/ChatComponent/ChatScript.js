// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html
let Channel = cc.Enum({
  WORLD_CHANNEL: 0,
  TEAM_CHANNEL: 1,
  PERSONAL_CHANNEL: 2
});

cc.Class({
  extends: cc.Component,
  properties: {
    // foo: {
    //     // ATTRIBUTES:
    //     default: null,        // The default value will be used only when the component attaching
    //                           // to a node for the first time
    //     type: cc.SpriteFrame, // optional, default is typeof default
    //     serializable: true,   // optional, default is true
    // },
    // bar: {
    //     get () {
    //         return this._bar;
    //     },
    //     set (value) {
    //         this._bar = value;
    //     }
    // },

    chatLayout: {
      default: null,
      type: cc.Layout
    },

    worldChannelButton: {
      default: null,
      type: cc.Toggle
    },
    teamChannelButton: {
      default: null,
      type: cc.Toggle
    },
    personalChannelButton: {
      default: null,
      type: cc.Toggle
    },
    channelTip: {
      default: null,
      type: cc.Label
    },
    channelState: {
      default: Channel.WORLD_CHANNEL,
      type: cc.Enum(Channel)
    },
    chatInput: {
      default: null,
      type: cc.EditBox
    },
    chatItemPrefab: {
      default: null,
      type: cc.Prefab
    },
    chatContent: {
        default: null,
        type: cc.Node
    }
  },

  // LIFE-CYCLE CALLBACKS:

  onLoad() {
    this.chatItems = [];
    this.userID = this.makeUUID();
    this.chatWS = new WebSocket("ws://127.0.0.1:8182");
    this.chatWS.onmessage = event => {
      this.getChatMessageFromServer(event.data);
    };

    this.chatItemNodePool = new cc.NodePool();
  },

  start() {},

  makeUUID() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
      var r = (Math.random() * 16) | 0,
        v = c == "x" ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  },

  changeToWorldChannel() {
    this.channelState = Channel.WORLD_CHANNEL;
    this.channelTip.string = "世";
  },

  changeToTeamChannel() {
    this.channelState = Channel.TEAM_CHANNEL;
    this.channelTip.string = "团";
  },

  changeToPersonalannel() {
    this.channelState = Channel.PERSONAL_CHANNEL;
    this.channelTip.string = "密";
  },

  getChatItemColor(channel) {
      switch(channel) {
          case Channel.WORLD_CHANNEL:
              return cc.Color.GREEN;
          case Channel.TEAM_CHANNEL:
              return cc.Color.BLUE;
          case Channel.PERSONAL_CHANNEL:
              return cc.Color.RED;
      }
  },

  getChatMessageFromServer(msg) {
    let msgJson = JSON.parse(msg);
    let chatItem = this.chatItemNodePool.size > 0 ? this.chatItemNodePool.get() : cc.instantiate(this.chatItemPrefab);
    chatItem.getComponent(cc.Label).string = msgJson.content;
    this.chatContent.addChild(chatItem);
    chatItem.color = this.getChatItemColor(msgJson.channel);
    chatItem.anchor = cc.v2(0, 0);
    chatItem.setPosition(cc.v2(0, 0)); 
    
    let contentHeight = 0;
    for(let i in this.chatItems) {
        let oriPosition = this.chatItems[i].getPosition();
        this.chatItems[i].setPosition(cc.v2(oriPosition.x, oriPosition.y + chatItem.height));
        contentHeight += this.chatItems[i].height;
    }
    contentHeight += chatItem.height;
    if(contentHeight > 1000) {
        contentHeight = 1000;
    }
    this.chatItems.push(chatItem);
    this.chatContent.height = contentHeight;
    this.chatContent.setPosition(cc.v2(0, 0));

    for(let i in this.chatItems) {
        let oriPosition = this.chatItems[i].getPosition();
        if(this.chatItems[i].position.y > 1500){
            this.chatItemNodePool.put(this.chatItems[i]);
            this.chatItems.splice(index, 1);
        }
    }
  },

  sendChatMessageToServer() {
    if (this.chatWS.readyState === WebSocket.OPEN) {
      let chatData = {
        userID: this.userID,
        channel: this.channelState,
        content: this.chatInput.string
      };
      this.chatInput.string = '';
      this.chatWS.send(JSON.stringify(chatData));
    }
  }

  // update (dt) {},
});

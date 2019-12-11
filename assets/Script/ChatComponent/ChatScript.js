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

  //频道发言后显示在聊天界面的消息颜色 
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

  //接受到服务端返回的消息的处理
  getChatMessageFromServer(msg) {
    let msgJson = JSON.parse(msg);

    //通过节点池或者预制体创建一个消息节点并放入到聊天消息界面节点中
    let chatItem = this.chatItemNodePool.size > 0 ? this.chatItemNodePool.get() : cc.instantiate(this.chatItemPrefab);
    chatItem.getComponent(cc.Label).string = msgJson.content;
    this.chatContent.addChild(chatItem);
    //因为节点要加入到场景中，才能设置生效其中的属性，因为布局的关系，这里设置锚点和坐标如代码中
    chatItem.color = this.getChatItemColor(msgJson.channel);
    chatItem.anchor = cc.v2(0, 0);
    chatItem.setPosition(cc.v2(0, 0)); 
    
    //因为消息窗口中，最新的消息总是显示在最下方，所以历史消息要根据新消息的高度向上移动
    let contentHeight = 0;
    for(let i in this.chatItems) {
        let oriPosition = this.chatItems[i].getPosition();
        this.chatItems[i].setPosition(cc.v2(oriPosition.x, oriPosition.y + chatItem.height));
        contentHeight += this.chatItems[i].height;
    }

    //给聊天消息窗口的ScrollView设置新的高度，并限定最大高度，免得消息窗口被撑到太高翻起来麻烦
    contentHeight += chatItem.height;
    if(contentHeight > 1000) {
        contentHeight = 1000;
    }

    //不知道什么原因，每次改变高度后坐标会变动，这里重新修改坐标
    this.chatItems.push(chatItem);
    this.chatContent.height = contentHeight;
    this.chatContent.setPosition(cc.v2(0, 0));

    //遍历一下所有聊天消息节点，如果有超过聊天窗口高度的，从节点中移除，节约逻辑消耗
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

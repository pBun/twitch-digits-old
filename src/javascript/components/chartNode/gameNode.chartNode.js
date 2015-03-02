var Node = require('./chartNode');

function GameNode(rawTwitchData){
  Node.call(this);

  this.type = Node.TYPES.GAME;
  this.name = rawTwitchData.game.name;
  this.viewers = rawTwitchData.viewers;
  this.image = rawTwitchData.game.box && rawTwitchData.game.box.large ?
                rawTwitchData.game.box.large : GameNode.DEFAULT_IMAGE;
  this.children = [];
  this.url = GameNode.GAME_URL_PREF + this.getEncodedName();

}
GameNode.prototype = Object.create(Node.prototype);
GameNode.prototype.constructor = GameNode;
GameNode.URL_PREF = 'http://twitch.tv/directory/game/';
GameNode.DEFAULT_IMAGE = '/assets/images/404_boxart-272x380.jpg';

module.exports = GameNode;

var Node = require('./chartNode');

function StreamNode(rawTwitchData){
  Node.call(this);

  this.type = Node.TYPES.STREAM;
  this.name = rawTwitchData.channel.name;
  this.viewers = rawTwitchData.viewers;
  this.image = rawTwitchData.channel.logo || StreamNode.DEFAULT_IMAGE;
  this.url = rawTwitchData.channel.url;
}
StreamNode.prototype = Object.create(Node.prototype);
StreamNode.prototype.constructor = StreamNode;
StreamNode.DEFAULT_IMAGE = '/assets/images/404_user_300x300.png';

module.exports = StreamNode;

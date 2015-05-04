var Node = require('./chartNode');

function RootNode(opts){
  Node.call(this, opts);

  this.type = Node.TYPES.ROOT;
  this.children = [];
}
RootNode.prototype = Object.create(Node.prototype);
RootNode.prototype.constructor = RootNode;

module.exports = RootNode;

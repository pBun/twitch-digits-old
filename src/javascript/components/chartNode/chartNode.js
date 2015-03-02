var Node = function(opts) {
  opts = opts || {};
  this.name = opts.name || '';
  this.viewers = opts.viewers || 0;
};
Node.TYPES = {
  ROOT: 'root',
  STREAM: 'stream',
  GAME: 'game'
};
Node.prototype.getEncodedName = function() {
  return encodeURIComponent(this.name);
};

module.exports = Node;

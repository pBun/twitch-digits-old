var angular = require('angular');

// Node object def
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

// Game node object def
function RootNode(opts){
  Node.call(this, opts);

  this.type = Node.TYPES.ROOT;
  this.children = [];
}
RootNode.prototype = Object.create(Node.prototype);
RootNode.prototype.constructor = RootNode;

// Game node object def
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

// Stream node object def
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



var service = function($q, Twitch) {

  this._twitch = Twitch;
  this._q = $q;

  this.streams;
  this.games;

};
service.$inject = ['$q', 'Twitch'];

service.prototype.sumViewers = function (items) {
  if (items == null) {
    return 0;
  }
  return items.reduce(function (a, b) {
    return b['viewers'] == null ? a : a + b['viewers'];
  }, 0);
};

service.prototype.getGames = function(offsetEnd, offsetStart) {
  var deferred = this._q.defer();
  offsetStart = offsetStart || 0;
  var gameLimit = offsetEnd ? Math.min(offsetEnd - offsetStart, 100) : 100;
  this._twitch.get('games/top?limit=' + gameLimit + '&offset=' + offsetStart).then(function(data) {
    var games = [];
    angular.forEach(data.top, function(game) {
      var gameNode = new GameNode(game);
      if (!gameNode.name) return;
      games.push(gameNode);
    });

    var nextOffsetStart = offsetStart + gameLimit;
    if (data._total > nextOffsetStart && (!offsetEnd || nextOffsetStart < offsetEnd)) {
      this.getGames(offsetEnd, nextOffsetStart).then(function(nextReqGames) {
        games = games.concat(nextReqGames);
        deferred.resolve(games);
      });
    } else {
      deferred.resolve(games);
    }

  }.bind(this));

  return deferred.promise;
};

service.prototype.getGameStreams = function(encodedGameName, offsetEnd, offsetStart) {
  var deferred = this._q.defer();
  offsetStart = offsetStart || 0;
  var streamLimit = offsetEnd ? Math.min(offsetEnd - offsetStart, 100) : 100;
  this._twitch.get('streams?limit=' + streamLimit + '&offset=' + offsetStart + '&game=' + encodedGameName).then(function(data) {
    var streams = [];
    angular.forEach(data.streams, function(stream) {
      var streamNode = new StreamNode(stream);
      streams.push(streamNode);
    });

    var nextReqOffsetStart = offsetStart + streamLimit;
    if (data._total > nextReqOffsetStart && (!offsetEnd || nextReqOffsetStart < offsetEnd)) {
      this.getGameStreams(encodedGameName, offsetEnd, nextReqOffsetStart).then(function(nextReqStreams) {
        streams = streams.concat(nextReqStreams);
        deferred.resolve(streams);
      });
    } else {
      deferred.resolve(streams);
    }

  }.bind(this));
  return deferred.promise;
};

service.prototype.getSnapshot = function(opts) {
  opts = opts || {};
  var gameOffset = opts.gameOffset || 0;
  var gameLimit = opts.gameLimit;
  var streamOffset = 0;
  var streamLimit = opts.streamLimit;

  var deferred = this._q.defer();

  this.root = new RootNode({ 'name': 'games' });
  this.getGames(gameOffset + gameLimit, gameOffset).then(function(games) {
    this.root.children = games;
    var totalGames = games.length;
    angular.forEach(games, function(game) {
      this.getGameStreams(game.getEncodedName(), streamOffset + streamLimit, streamOffset).then(function(streams) {
        var streamViewers = this.sumViewers(streams);
        game.viewers = streamViewers;
        this.root.viewers += streamViewers;
        game.children = streams;
        if (--totalGames <= 0) {
          deferred.resolve(this.root);
        }
      }.bind(this));
    }.bind(this));
  }.bind(this));

  return deferred.promise;
};

module.exports = service;


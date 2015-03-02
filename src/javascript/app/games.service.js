var angular = require('angular');

var RootNode = require('./../components/chartNode/rootNode.chartNode');
var GameNode = require('./../components/chartNode/gameNode.chartNode');
var StreamNode = require('./../components/chartNode/streamNode.chartNode');

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

  var manualTallyGameViewers = !streamLimit;
  var manualTallyRootViwers = manualTallyGameViewers && !gameLimit;

  var deferred = this._q.defer();

  this.root = new RootNode({ 'name': 'games' });

  // get games
  this.getGames(gameOffset + gameLimit, gameOffset).then(function(games) {
    this.root.children = games;
    var totalGames = games.length;

    // get total number of viewers if we aren't manually tally'ing
    if (!manualTallyRootViwers) {
      this._twitch.get('streams/summary').then(function(data) {
        this.root.viewers = data.viewers;
      }.bind(this));
    }

    // format each game and get live streams
    angular.forEach(games, function(game) {
      this.getGameStreams(game.getEncodedName(), streamOffset + streamLimit, streamOffset).then(function(streams) {

        // if loading all streams we don't have to rely on twitch's inaccurate numbers
        // and can manually tally the viewers for precise statistics
        if (manualTallyGameViewers) {
          var streamViewers = this.sumViewers(streams);
          game.viewers = streamViewers;
        }
        if (manualTallyRootViwers) {
          this.root.viewers += streamViewers;
        }

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


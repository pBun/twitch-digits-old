var angular = require('angular');

var service = function($q, Twitch) {

  this._twitch = Twitch;
  this._q = $q;

  this.streams;
  this.games;

  this.defaultBoxImage =  '/assets/images/404_boxart-272x380.jpg';
  this.defaultUserImage =  '/assets/images/404_user_300x300.png';

};
service.$inject = ['$q', 'Twitch'];

service.prototype.getStreamSummary = function() {
  var deferred = this._q.defer();
  this._twitch.get('streams/summary').then(function(data) {
    this.streams = {};
    this.streams.viewers = data.viewers;
    this.streams.channels = data.channels;
    deferred.resolve(this.streams);
  }.bind(this));
  return deferred.promise;
};

service.prototype.getGameStreams = function(encodedGameName, streamLimit) {
  var deferred = this._q.defer();
  this._twitch.get('streams?limit=' + streamLimit + '&game=' + encodedGameName).then(function(data) {
    deferred.resolve(data.streams);
  });
  return deferred.promise;
};

service.prototype.formatGame = function(game, streamLimit) {
  var deferred = this._q.defer();
  var gameArt = game.game.box ? game.game.box.large || this.defaultBoxImage : this.defaultBoxImage;
  var g = {
    'type': 'game',
    'name': game.game.name,
    'encodedName': encodeURIComponent(game.game.name),
    'url': 'http://twitch.tv/directory/game/' + encodeURIComponent(game.game.name),
    'image': gameArt,
    'viewers': game.viewers,
    'children': []
  };

  var gameViewers = game.viewers;
  var otherStreamViewers = gameViewers;
  this.getGameStreams(g.encodedName, streamLimit).then(function(streams) {

    // add each of the streams to our game object
    angular.forEach(streams, function(stream, i) {
      var s = {
        'type': 'stream',
        'name': stream.channel.name,
        'image': stream.channel.logo || this.defaultUserImage,
        'url': stream.channel.url,
        'viewers': stream.viewers
      };
      g.children.push(s);
      otherStreamViewers = otherStreamViewers - stream.viewers;
    }.bind(this));

    // add other stream option
    var os = {
      'type': 'stream',
      'name': 'other streams',
      'image': this.defaultUserImage,
      'url': g.url,
      'viewers': otherStreamViewers
    };
    g.children.push(os);

    deferred.resolve(g);

  }.bind(this));

  return deferred.promise;
};

service.prototype.getGames = function(opts) {
  var deferred = this._q.defer();
  opts = opts || {};
  opts.gameLimit = opts.gameLimit || 10;
  opts.streamLimit = opts.streamLimit || 5;
  this.games = {
    'type': 'root',
    'name': 'games',
    'children': []
  };
  this.getStreamSummary().then(function(streamSummary) {
    var totalViewers = streamSummary.viewers;
    var otherGamesViewers = totalViewers;
    this.games.viewers = totalViewers;
    this._twitch.get('games/top?limit=' + opts.gameLimit).then(function(data) {
      var gamesToFormat = data.top.length;
      angular.forEach(data.top, function(game, i) {
        otherGamesViewers = otherGamesViewers - game.viewers;
        this.formatGame(game, opts.streamLimit).then(function(formattedGame) {
          this.games.children.push(formattedGame);
          if (!--gamesToFormat) {
            var g = {
              'type': 'game',
              'name': 'other games',
              'image': this.defaultBoxImage,
              'url': 'http://twitch.tv/directory',
              'viewers': otherGamesViewers,
              'children': [{
                'type': 'stream',
                'name': 'other streams',
                'image': this.defaultUserImage,
                'url': 'http://twitch.tv/directory/all',
                'viewers': otherGamesViewers
              }]
            };
            this.games.children.push(g);
            deferred.resolve(this.games);
          }
        }.bind(this));
      }.bind(this));
    }.bind(this));
  }.bind(this));
  return deferred.promise;
};

module.exports = service;


var angular = require('angular');

var service = function($http, $q) {

  this.domain = 'https://api.twitch.tv/kraken/';

  this._http = $http;
  this._q = $q;

};
service.$inject = ['$http', '$q'];

service.prototype.get = function(request) {
  var deferred = this._q.defer();

  this._http.jsonp(this.domain + request + '?callback=JSON_CALLBACK')
    .success(deferred.resolve)
    .error(deferred.reject);

  return deferred.promise;
};

module.exports = service;

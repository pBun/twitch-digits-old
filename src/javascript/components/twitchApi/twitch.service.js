var angular = require('angular');

var service = function($http, $q) {

  this.domain = 'https://api.twitch.tv/kraken/';

  this._http = $http;
  this._q = $q;

};
service.$inject = ['$http', '$q'];

service.prototype.fixQueryString = function(url) {
    var queryString = url.split('?');
    var baseUrl = queryString.shift();
    if (queryString && queryString.length) {
      url = baseUrl + '?' + queryString.join('&');
    }
    return url;
};

service.prototype.get = function(request) {
  var deferred = this._q.defer();
  var url = this.domain + request + '?callback=JSON_CALLBACK';
  url = this.fixQueryString(url);
  this._http.jsonp(url)
    .success(deferred.resolve)
    .error(deferred.reject);

  return deferred.promise;
};

module.exports = service;

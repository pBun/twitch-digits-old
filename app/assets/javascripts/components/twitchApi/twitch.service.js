var angular = require('angular');

var service = function($http, $q) {

  this.domain = 'https://api.twitch.tv/kraken/';

  this._http = $http;
  this._q = $q;

  // this._twitchAppID = 'eo7lzdc6ztvx2unetp7g34cnarh3148'; // dev
  this._twitchAppID = '3m7g6nmmmaat5ftz9tyldgqfepk817f';

};
service.$inject = ['$http', '$q'];

service.prototype.buildQueryString = function(options) {
  options = options || {};
  var queryStringComponents = Object.keys(options).map(function(name) {
    if (options[name]) {
      return name + '=' + options[name];
    }
  });
  return '?' + queryStringComponents.join('&');
};

service.prototype.fixQueryString = function(url) {
    var queryString = url.split('?');
    var baseUrl = queryString.shift();
    if (queryString && queryString.length) {
      url = baseUrl + '?' + queryString.join('&');
    }
    return url;
};

service.prototype.get = function(request, options) {
  var deferred = this._q.defer();
  var defaultOptions = {
    'client_id': this._twitchAppID,
    'callback': 'JSON_CALLBACK'
  };
  options = angular.extend({}, (options || {}), defaultOptions);

  var queryString = this.buildQueryString(options);

  // build final url
  var url = this.domain + request + queryString;

  // just in case user added a query string to the req
  url = this.fixQueryString(url);

  this._http.jsonp(url)
    .success(function(data) {
      if (data.error) {
        var err = {};
        err.type = 'api';
        err.msg = '';
        if (data.status) {
          err.msg += data.status + ' ';
        }
        if (data.error) {
          err.msg += data.error + ': ';
        }
        if (data.message) {
          err.msg += data.message + ' ';
        }
        err.msg += '(' + url + ')';
        deferred.reject(err);
      }
      deferred.resolve(data);
    })
    .error(deferred.reject);

  return deferred.promise;
};

module.exports = service;

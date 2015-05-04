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

  // work-around for twitch.tv api streams req not supporting client_id
  // https://github.com/justintv/Twitch-API/issues/334
  if (request === 'streams') {
    options['client_id'] = null;
  }

  var queryString = this.buildQueryString(options);

  // build final url
  var url = this.domain + request + queryString;

  // just in case user added a query string to the req
  url = this.fixQueryString(url);

  this._http.jsonp(url)
    .success(function(data) {
      if (data.error) {
        var errorMsg = '';
        if (data.status) {
          errorMsg += data.status + ' ';
        }
        if (data.error) {
          errorMsg += data.error + ': ';
        }
        if (data.message) {
          errorMsg += data.message + ' ';
        }
        errorMsg += '(' + url + ')';
        deferred.reject(errorMsg);
      }
      deferred.resolve(data);
    })
    .error(deferred.reject);

  return deferred.promise;
};

module.exports = service;

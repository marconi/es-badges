'use strict';

var AsyncStorage = require('react-native').AsyncStorage;
var buffer = require('buffer');
var _ = require('lodash');

var OrgStore = require('./org');

var AUTH_KEY = 'auth';
var USER_KEY = 'user';


class AuthStore {
  static getAuthInfo(cb) {
    AsyncStorage.multiGet([AUTH_KEY, USER_KEY], (err, val) => {
      if (err) { return cb(err, null); }
      if (!val) { return cb(null, null); }

      var zippedObj = _.zipObject(val);
      if (!zippedObj[AUTH_KEY]) { return cb(null, null); }
      var authInfo = {
        headers: {Authorization: 'Basic ' + zippedObj[AUTH_KEY]},
        user: JSON.parse(zippedObj[USER_KEY])
      };

      return cb(null, authInfo);
    });
  }

  static login(creds, cb) {
    var b = new buffer.Buffer(creds.username + ':' + creds.password);
    var encodedAuth = b.toString('base64');
    var payload = {headers: {'Authorization': 'Basic ' + encodedAuth}};

    AuthStore._authUser(payload, (err, data) => {
      if (err) { return cb(err); }

      OrgStore.checkOrg(payload, (err) => {
        if (err) { return cb(err); }

        AsyncStorage.multiSet([
          [AUTH_KEY, encodedAuth],
          [USER_KEY, JSON.stringify(data)]
        ], (err) => {
          if (err) { return cb(err); }
          return cb({success: true});
        });
      });
    });
  }

  static logout(cb) {
    OrgStore.clearOrg(() => {
      AsyncStorage.multiRemove([AUTH_KEY, USER_KEY], (err) => { cb(); });
    });
  }

  static _authUser(payload, cb) {
    fetch('https://api.github.com/user', payload)
      .then((response) => {
        if (response.status >= 200 && response.status < 300) {
          return response;
        }
        throw {
          badCredentials: response.status === 401,
          unknownError: response.status !== 401
        };
      })
      .then((response) => { return response.json(); })
      .then((data) => { return cb(null, data); })
      .catch((err) => { return cb(err, null); });
  }
};

module.exports = AuthStore;

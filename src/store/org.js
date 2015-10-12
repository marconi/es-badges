'use strict';

var AsyncStorage = require('react-native').AsyncStorage;
var _ = require('lodash');

var ES_ORG_KEY = 'esorg';
var ES_ORG_LOGIN = 'engagespark';

class OrgStore {
  static getEsOrg(cb) {
    AsyncStorage.getItem(ES_ORG_KEY, (err, val) => {
      if (err) { return cb(err); }
      return cb(JSON.parse(val));
    })
  }

  static getMembers(orgLogin, headers, cb) {
    var url = 'https://api.github.com/orgs/' + orgLogin + '/members';
    fetch(url, {headers: headers})
      .then((response) => response.json())
      .then((data) => { return cb(null, data); })
      .catch((err) => { return cb(err, null); });
  }

  static checkOrg(payload, cb) {
    fetch('https://api.github.com/user/orgs', payload)
      .then((response) => { return response.json(); })
      .then((orgs) => {
        var esOrg = _.find(orgs, (org) => { return org.login === ES_ORG_LOGIN; });
        if (esOrg) {
          AsyncStorage.setItem(ES_ORG_KEY, JSON.stringify(esOrg), (err) => {
            if (err) { return cb(err); }
            return cb(null);
          })
        } else {
          throw {badCredentials: true, unknownError: false};
        }
      })
      .catch((err) => { return cb(err); });
  }

  static clearOrg(cb) {
    AsyncStorage.removeItem(ES_ORG_KEY, (err) => { cb(); });
  }
};

module.exports = OrgStore;

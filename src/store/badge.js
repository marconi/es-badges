'use strict';

var _ = require('lodash');

var BADGES = [
  'challenge/system-file-io',
  'challenge/system-unicode-basics',
  'challenge/system-standard-streams',
  'community/meetup-attended',
  'community/meetup-talk',
  'community/meetup-organized',
  'firefight/weekly-chief',
  'firefight/all-nighter',
  'opensource/issue-reported',
  'opensource/issue-solved',
  'opensource/project-maintained',
  'opensource/project-created',
  'teaching/challenge-created',
  'teaching/learn-thursday',
  'teaching/movie-proposed',
  'teaching/pair-programming',
];

var badgeToImage = {
  challenge: require('image!keyboard'),
  community: require('image!house'),
  firefight: require('image!fire'),
  teaching: require('image!toga'),
  opensource: require('image!oss'),
};

class BadgeStore {
  static getBadges(userLogin, cb) {
    BadgeStore._loadBadges((badges) => {
      var userBadges = _.find(badges, (badge) => {
        return badge.login === userLogin;
      });
      if (!userBadges) { return cb(null); }
      cb(userBadges.badges);
    });
  }

  static getBadgeImage(badge) {
    var badgeType = badge.split('/')[0];
    return badgeToImage[badgeType];
  }

  static getAllBadges() {
    return BADGES;
  }

  static _loadBadges(cb) {
    var badges = require('./badges.json');
    cb(badges);
  }
};

module.exports = BadgeStore;

'use strict';

var React = require('react-native');
var _ = require('lodash');

var {
  Component,
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  ListView,
} = React;

var BadgeStore = require('../store/badge');

class UserDetails extends Component {
  constructor(props) {
    super(props);

    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 != r2});
    this.state = {
      dataSource: ds.cloneWithRows([]),
    };
  }

  componentDidMount() {
    BadgeStore.getBadges(this.props.user.login, (badges) => {
      var badgeToTags = {};
      _.forEach(badges, (badge) => {
        var tmp = badge.split(':');
        if (_.has(badgeToTags, tmp[0])) {
          badgeToTags[tmp[0]].push(tmp[1]);
        } else {
          badgeToTags[tmp[0]] = [tmp[1]];
        }
      });

      var allBadges = _.map(BadgeStore.getAllBadges(), (badge) => {
        var isActive = _.has(badgeToTags, badge);
        var name = (isActive) ? badge + ':' + badgeToTags[badge].join(',') : badge;
        return {name: name, isActive: isActive};
      });

      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(allBadges)
      });
    });
  }

  renderRow(rowData, sectionId, rowId) {
    var badgeImageStyle = (rowData.isActive) ? styles.badgeActive : styles.badgeInactive;
    var badgeTextStyle = (rowData.isActive) ? styles.badgeTextActive : styles.badgeTextInactive;
    return <TouchableOpacity>
              <View style={styles.row}>
                <View style={[styles.badgeImageWrapper, badgeImageStyle]}>
                  <Image
                    style={styles.badgeImage}
                    source={BadgeStore.getBadgeImage(rowData.name)} />
                </View>
                <Text style={badgeTextStyle}>{rowData.name}</Text>
              </View>
            </TouchableOpacity>
  }

  render() {
    return <View style={styles.container}>
              <View style={styles.userDetailsRow}>
                <View style={{flex: 1, flexDirection: 'row'}}>
                  <Image
                    source={{uri: this.props.user.avatar_url}}
                    style={styles.userAvatar} />
                  <View style={styles.userDetails}>
                    <Text style={styles.userLogin}>{this.props.user.login}</Text>
                    <Text style={styles.userUrl}>{this.props.user.html_url}</Text>
                  </View>
                </View>
              </View>
              <View style={styles.badgesRow}>
                <ListView
                  dataSource={this.state.dataSource}
                  renderRow={this.renderRow.bind(this)} />
              </View>
            </View>
  }
};

var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#222222',
  },
  userDetailsRow: {
    height: 60,
    padding: 20,
  },
  badgesRow: {
    flex: 1,
    marginTop: 20,
  },
  userAvatar: {
    height: 40,
    width: 40,
    borderRadius: 20,
  },
  userDetails: {
    flex: 1,
    marginLeft: 20,
  },
  userLogin: {
    fontWeight: 'bold',
    color: '#ffffff',
  },
  userUrl: {
    color: '#05A5D1',
  },
  badges: {
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#ffffff',
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    padding: 10,
    alignItems: 'center',
    borderColor: '#555555',
    borderBottomWidth: 1,
  },
  badgeImageWrapper: {
    width: 34,
    height: 34,
    borderRadius: 17,
    marginRight: 10,
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  badgeImage: {
    width: 24,
    height: 24,
    marginTop: 3,
    marginLeft: 3,
  },
  badgeActive: {
    backgroundColor: '#e66c2c',
  },
  badgeInactive: {
    backgroundColor: '#555555',
  },
  badgeTextActive: {
    color: '#e66c2c',
  },
  badgeTextInactive: {
    color: '#555555',
  }
});

module.exports = UserDetails;

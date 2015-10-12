'use strict';

var React = require('react-native');
var _ = require('lodash');

var {
  Component,
  StyleSheet,
  View,
  Image,
  Text,
  ListView,
  TouchableHighlight,
  TouchableOpacity,
  Navigator,
} = React;

var UserDetails = require('./userdetails');
var AuthStore = require('../store/auth');
var OrgStore = require('../store/org');

var NavigationBarRouteMapper = {
  LeftButton: (route, navigator, index, navState) => {
    if (index === 0) { return null; }
    return <TouchableOpacity
              style={[styles.navBarButton, styles.navBarBack]}
              onPress={() => navigator.pop()}>
                <Text style={styles.navBarText}>&laquo; Back</Text>
            </TouchableOpacity>
  },

  RightButton: (route, navigator, index, navState) => {
    return <TouchableOpacity
              style={[styles.navBarButton, styles.navBarBack]}
              onPress={() => navigator.props.onLogout() }>
                <Text style={styles.navBarText}>Logout &raquo;</Text>
            </TouchableOpacity>
  },

  Title: (route, navigator, index, navState) => {
    var title = 'engageSpark Members';
    if (route.user) { title = route.user.login; }
    return <TouchableOpacity
              style={[styles.navBarButton, styles.navBarTitle]}>
              <Text style={[styles.navBarText, styles.navBarTitleText]}>{title}</Text>
            </TouchableOpacity>
  },
};

class UserList extends Component {
  constructor(props) {
    super(props);

    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 != r2});
    this.state = {
      dataSource: ds.cloneWithRows([]),
      isFetchingMembers: false,
    };
  }

  componentDidMount() {
    this._fetchFeed();
  }

  rowPressed(rowData) {
    this.props.navigator.push({
      id: 'userDetails',
      user: rowData,
    });
  }

  renderRow(rowData, sectionId, rowId) {
    return <TouchableOpacity onPress={() => this.rowPressed(rowData)}>
              <View style={styles.row}>
                <Image
                  source={{uri: rowData.avatar_url}}
                  style={styles.userAvatar} />
                <View style={{paddingLeft: 20}}>
                  <Text style={styles.userListLogin}>{rowData.login}</Text>
                </View>
              </View>
            </TouchableOpacity>
  }

  render() {
    return <ListView
              dataSource={this.state.dataSource}
              renderRow={this.renderRow.bind(this)} />
  }

  _fetchFeed() {
    this.setState({isFetchingMembers: true});
    OrgStore.getMembers(
      this.props.esOrg.login,
      this.props.authInfo.headers,
      (err, data) => {
        var newState = {isFetchingMembers: false};
        if (err) {
          console.log(err);
        } else {
          newState.dataSource = this.state.dataSource.cloneWithRows(data);
        }
        this.setState(newState);
      });
  }
};

class Feed extends Component {
  constructor(props) {
    super(props);

    this.state = {
      esOrg: null,
      isFetchingOrg: true,
    };
  }

  componentDidMount() {
    OrgStore.getEsOrg((org) => {
      this.setState({
        esOrg: org,
        isFetchingOrg: false,
      });
    });
  }

  renderScene(route, navigator) {
    switch (route.id) {
      case 'userDetails':
        return <View style={styles.scene}>
                  <UserDetails
                    navigator={navigator}
                    user={route.user} />
                </View>
      default:
        return <View style={styles.scene}>
                  <UserList
                    authInfo={this.props.authInfo}
                    esOrg={this.state.esOrg}
                    navigator={navigator} />
                </View>
    }
  }

  render() {
    if (this.state.isFetchingOrg) {
      return <View style={styles.container}>
                <Text>Please wait...</Text>
              </View>
    }

    var navbar = <Navigator.NavigationBar
                    style={styles.navBar}
                    routeMapper={NavigationBarRouteMapper} />
    return <Navigator
              onLogout={this.props.onLogout}
              initialRoute={{id: 'userList'}}
              renderScene={this.renderScene.bind(this)}
              navigationBar={navbar} />
  }
};

var styles = StyleSheet.create({
  container: {
    backgroundColor: '#222222',
    flex: 1,
    padding: 20,
  },
  scene: {
    flex: 1,
    marginTop: 40,
    backgroundColor: '#222222',
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    padding: 10,
    alignItems: 'center',
    borderColor: '#555555',
    borderBottomWidth: 1,
  },
  userAvatar: {
    height: 40,
    width: 40,
    borderRadius: 20,
  },
  navBar: {
    height: 40,
    backgroundColor: '#555555',
  },
  navBarButton: {
    height: 40,
    marginTop: 16,
    paddingTop: 8,
  },
  navBarText: {
    fontSize: 16,
    color: '#ffffff',
  },
  navBarBack: {
    marginTop: 0,
    marginLeft: 10,
  },
  navBarTitle: {
    flex: 1,
    marginLeft: 10,
  },
  navBarTitleText: {
    alignSelf: 'stretch',
  },
  userListLogin: {
    fontWeight: '600',
    color: '#ffffff',
  },
});

module.exports = Feed;

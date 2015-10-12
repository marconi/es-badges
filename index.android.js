'use strict';

var React = require('react-native');
var {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Component,
  ProgressBarAndroid,
} = React;

var Login = require('./src/component/login');
var Feed = require('./src/component/feed');
var AuthStore = require('./src/store/auth');

class ESBadges extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoggedIn: false,
      isLoggingIn: false,
      isCheckingAuth: true,
      authInfo: null,
    };
  }

  componentDidMount() {
    this._getAuthInfo();
  }

  onLogin() {
    this._getAuthInfo(() => { this.setState({isLoggingIn: false}); });
  }

  onLogout() {
    AuthStore.logout(() => { this.setState({isLoggedIn: false}); });
  }

  render() {
    if (this.state.isCheckingAuth) {
      return <View style={styles.preloaderWrapper}>
                <ProgressBarAndroid
                  style={styles.preloader}
                  styleAttr="Large" />
              </View>
    }

    if (this.state.isLoggingIn) {
      return <View style={styles.container}>
                <Text>Logging in...</Text>
              </View>
    }

    if (!this.state.isLoggedIn) {
      return <Login onLogin={this.onLogin.bind(this)} />      
    }

    return <Feed
              onLogout={this.onLogout.bind(this)}
              authInfo={this.state.authInfo} />
  }

  _getAuthInfo(cb) {
    AuthStore.getAuthInfo((err, authInfo) => {
      this.setState({
        isCheckingAuth: false,
        isLoggedIn: authInfo !== null,
        authInfo: authInfo,
      });

      if (cb) cb();
    });
  }
};

var styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#222222',
  },
  preloaderWrapper: {
    flex: 1,
    justifyContent: 'center',
  },
  preloader: {
    alignSelf: 'center',
  },
});

AppRegistry.registerComponent('eSbadges', () => ESBadges);

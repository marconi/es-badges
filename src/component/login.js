'use strict';

var React = require('react-native');

var {
  Component,
  StyleSheet,
  View,
  Image,
  Text,
  TextInput,
  TouchableHighlight,
  ProgressBarAndroid,
} = React;

var AuthStore = require('../store/auth');

class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoggingIn: false,
      username: null,
      password: null,
    };
  }

  onLogin() {
    this.setState({isLoggingIn: true});
    AuthStore.login({
      username: this.state.username,
      password: this.state.password
    }, (result) => {
      this.setState(Object.assign({isLoggingIn: false}, result));
      if (result.success && this.props.onLogin) { this.props.onLogin(); }
    });
  }

  render() {
    var error;
    if (!this.state.success && this.state.badCredentials) {
      error = <Text style={styles.error}>
                Its either your username or password is incorrect.
              </Text>
    }
    if (!this.state.success && this.state.unknownError) {
      error = <Text style={styles.error}>
                We experienced an unexpected issue.
              </Text>
    }

    var loginForm;
    if (!this.state.isLoggingIn) {
      loginForm = <View style={styles.form}>
                    <TextInput
                      style={styles.input}
                      placeholder="Github username"
                      onChangeText={(text) => this.setState({username: text})} />
                    <TextInput
                      style={styles.input}
                      placeholder="Github oauth token"
                      secureTextEntry={true}
                      onChangeText={(text) => this.setState({password: text})} />
                    <TouchableHighlight
                      style={styles.button}
                      onPress={this.onLogin.bind(this)}>
                      <Text style={styles.buttonText}>Login</Text>
                    </TouchableHighlight>
                    {error}
                  </View>
    } else {
      loginForm = <View style={styles.preloaderWrapper}>
                    <ProgressBarAndroid
                      style={styles.preloader}
                      styleAttr="Large" />
                  </View>
    }

    return (
      <View style={styles.container}>
        <Image
          style={styles.logo}
          source={require('image!eslogo_287')} />
        {loginForm}
      </View>
    )
  }
};

var styles = StyleSheet.create({
  container: {
    backgroundColor: '#222222',
    flex: 1,
    paddingTop: 40,
    padding: 20,
  },
  form: {
    alignItems: 'center',
  },
  logo: {
    marginBottom: 40,
    alignSelf: 'center',
  },
  input: {
    height: 50,
    marginTop: 10,
    padding: 4,
    fontSize: 18,
    borderWidth: 1,
    borderColor: '#48bbec',
    color: '#ffffff',
  },
  button: {
    height: 50,
    backgroundColor: '#e66c2c',
    marginTop: 10,
    alignSelf: 'stretch',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 22,
    color: '#ffffff',
  },
  preloaderWrapper: {
    flex: 1,
    justifyContent: 'center',
  },
  preloader: {
    alignSelf: 'center',
  },
  error: {
    color: 'red',
    marginTop: 10,
  },
});

module.exports = Login;

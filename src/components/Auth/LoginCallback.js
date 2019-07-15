import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { CallbackComponent } from 'redux-oidc';
import { push as routerPush } from 'connected-react-router';

import userManager from '../../helpers/usermanager';

class LoginCallback extends PureComponent {
  static propTypes = {
    push: PropTypes.func.isRequired,
  };

  successCallback = (user) => {
    // Push the location that was set when the sign-in flow started.
    let location = '/';
    try {
      const state = JSON.parse(user.state);
      if (state.location) {
        location = state.location;
      }
    } catch (err) {
      console.error('LoginCallback.successCallback: JSON.parse(user.state):', err, user);
    }

    this.props.push(location);
  };

  errorCallback = (err) => {
    console.error('LoginCallback.errorCallback: ', err);
    this.props.push('/');
  };

  render() {
    return (
      <CallbackComponent
        userManager={userManager}
        successCallback={this.successCallback}
        errorCallback={this.errorCallback}
      >
        <div className="fullscreen-centered">
          <h1>Redirecting...</h1>
        </div>
      </CallbackComponent>
    );
  }
}

function mapDispatch(dispatch) {
  return bindActionCreators({
    push: routerPush,
  }, dispatch);
}

export default connect(null, mapDispatch)(LoginCallback);

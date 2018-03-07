import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { actions } from '../../redux/modules/system';

class LeaveTabListener extends Component {

  componentDidMount() {
    window.addEventListener('visibilitychange', this.visibilityChange);
  }

  componentWillUnmount() {
    window.removeEventListener('visibilitychange', this.visibilityChange);
  }

  visibilityChange = () => {
    this.props.visibilityStateChanged(document.visibilityState);
  };

  render() {
    return null;
  }
}

const mapDispatch = dispatch => (
  bindActionCreators({ visibilityStateChanged: actions.visibilityStateChanged }, dispatch)
);

export default connect(null, mapDispatch)(LeaveTabListener);

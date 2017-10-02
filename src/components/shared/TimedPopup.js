import React, { Component } from 'react';
import PropTypes from 'prop-types';

// NOTE: The rendering of this component should use Popup but there
// is a bug: https://github.com/Semantic-Org/Semantic-UI-React/issues/1065
// When solved use Popup, and update parrents to pass trigger properly.
//
// import { Popup } from 'semantic-ui-react';
//
// <Popup
//   open={opened}
//   content={message}
//   position={`${downward ? 'bottom' : 'top'} right`}
//   offset={10}
//   trigger={trigger}
// />

const POPOVER_CONFIRMATION_TIMEOUT = 2500;

class TimedPopup extends Component {

  static propTypes = {
    message: PropTypes.string.isRequired,
    downward: PropTypes.bool,
    trigger: PropTypes.object,
    openOnInit: PropTypes.bool,
    timeout: PropTypes.number,
  };

  static defaultProps = {
    downward: false,
    trigger: null,
    openOnInit: false,
    timeout: POPOVER_CONFIRMATION_TIMEOUT,
  };

  state = {
    opened: false
  };

  confirmTimeoutHandle = null;

  componentWillMount() {
    const { openOnInit } = this.props;
    if (openOnInit) {
      this.open();
    }
  }

  componentWillUnmount() {
    this.clearConfirmationTimeout();
  }

  clearConfirmationTimeout = () => {
    if (this.confirmTimeoutHandle) {
      clearTimeout(this.confirmTimeoutHandle);
      this.confirmTimeoutHandle = null;
    }
  }

  onTrigger = () => {
    if (this.props.onTrigger) {
      this.props.onTrigger();
    }
  }

  open = () => {
    this.clearConfirmationTimeout();
    this.setState({ opened: true }, () => {
      this.confirmTimeoutHandle = setTimeout(
        () => this.setState({ opened: false }),
          this.props.timeout);
    });
  };

  render() {
    const { message, downward, trigger } = this.props;
    const { opened } = this.state;

    const style = {
      position: 'absolute',
      right: 0,
    };
    if (downward) {
      style.top = 0;
    } else {
      style.bottom = 0;
    }

    return (
      opened ? (
        <div style={{position: 'relative'}}>
          <div className="popup" style={style}>
            <div className="content">{message}</div>
          </div>
        </div>
      ) : null
    );
  }
}

export default TimedPopup;

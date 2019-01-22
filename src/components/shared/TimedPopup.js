import React, { Component } from 'react';
import PropTypes from 'prop-types';

// NOTE: The rendering of this component should use Popup but there
// is a bug: https://github.com/Semantic-Org/Semantic-UI-React/issues/1065
// When solved use Popup, and update parents to pass trigger properly.
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
    onTrigger: PropTypes.func,
    openOnInit: PropTypes.bool,
    timeout: PropTypes.number,
  };

  static defaultProps = {
    downward: false,
    onTrigger: null,
    openOnInit: false,
    timeout: POPOVER_CONFIRMATION_TIMEOUT,
  };

  confirmTimeoutHandle = null;

  constructor(props) {
    super(props);
    this.state = {
      opened: false,
    };
  }

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
  };

  onTrigger = () => {
    const { onTrigger } = this.props;
    if (onTrigger) {
      onTrigger();
    }
  };

  open = () => {
    this.clearConfirmationTimeout();
    this.setState({ opened: true }, () => {
      this.confirmTimeoutHandle = setTimeout(
        () => this.setState({ opened: false }),
        this.props.timeout);
    });
  };

  render() {
    const { message, downward } = this.props;
    const { opened }            = this.state;

    const style = {
      position: 'absolute',
      right: 0,
      [downward ? 'top' : 'bottom']: 0,
    };
    return (
      opened ? (
        <div style={{ position: 'relative' }}>
          <div className="popup" style={style}>
            <div className="content">{message}</div>
          </div>
        </div>
      ) : null
    );
  }
}

export default TimedPopup;

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Popup } from 'semantic-ui-react';
import { isLanguageRtl } from '../../helpers/i18n-utils';
import { Reference } from '../shapes';

const POPOVER_CONFIRMATION_TIMEOUT = 2500;

class TimedPopup extends Component {
  static propTypes = {
    message: PropTypes.string.isRequired,
    downward: PropTypes.bool,
    onTrigger: PropTypes.func,
    openOnInit: PropTypes.bool,
    timeout: PropTypes.number,
    language: PropTypes.string.isRequired,
    refElement: Reference,
  };

  static defaultProps = {
    downward: false,
    onTrigger: null,
    openOnInit: false,
    timeout: POPOVER_CONFIRMATION_TIMEOUT,
    refElement: null,
  };

  state = {};

  confirmTimeoutHandle = null;

  componentWillReceiveProps(nextProps) {
    const { openOnInit } = nextProps;
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
    const { message, downward, language, refElement } = this.props;
    const { opened }                                  = this.state;
    const style                                       = {
      position: 'absolute',
      right: 0,
      [downward ? 'top' : 'bottom']: 0,
    };
    if (downward) {
      style.top = 0;
    } else {
      style.bottom = 0;
    }
    const rtlLang = isLanguageRtl(language);

    return (
      <Popup
        open={opened}
        content={message}
        position={`${downward ? 'bottom' : 'top'} right`}
        className={rtlLang ? 'change-popup-direction' : ''}
        context={refElement}
      />
    );
  }
}

export default TimedPopup;

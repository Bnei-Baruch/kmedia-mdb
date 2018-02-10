import React, { Component } from 'react';
import UAParser from 'ua-parser-js';

const parser = new UAParser().getResult();
const isMobileDevice = parser.device.type === 'mobile';

const MOBILE_WIDTH = 768;
export default function withIsMobile(SomeComponent) {
  return class extends Component {
    constructor() {
      super();
      this.state = {
        isMobile: this.width() <= MOBILE_WIDTH,
      };
    }

    componentDidMount() {
      this.componentIsMounted = true;
      window.addEventListener('resize', this.handleWindowSizeChange);
      this.handleWindowSizeChange();
    }

    componentWillUnmount() {
      window.removeEventListener('resize', this.handleWindowSizeChange);
      this.componentIsMounted = false;
    }

    width = () => document.documentElement.clientWidth;

    handleWindowSizeChange = () => {
      if (this.componentIsMounted && this.state.isMobile !== (this.width() <= MOBILE_WIDTH)) {
        this.setState({ isMobile: this.width() <= MOBILE_WIDTH });
      }
    };


    render() {

      const { isMobile } = this.state;
      return (
        <SomeComponent
          {...this.props}
          isMobile={isMobile}
          isMobileDevice={isMobileDevice}
        />
      );
    }
  };
}

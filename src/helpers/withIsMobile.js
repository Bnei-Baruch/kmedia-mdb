import React, { Component } from 'react';

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
      this.isMounted = true;
      window.addEventListener('resize', this.handleWindowSizeChange);
      this.handleWindowSizeChange();
    }

    componentWillUnmount() {
      window.removeEventListener('resize', this.handleWindowSizeChange);
      this.isMounted = false;
    }

    width = () => document.documentElement.clientWidth;

    handleWindowSizeChange = () => {
      if (this.isMounted && this.state.isMobile !== (this.width() <= MOBILE_WIDTH)) {
        this.setState({ isMobile: this.width() <= MOBILE_WIDTH });
      }
    };

    render() {
      const { isMobile } = this.state;

      return (
        <SomeComponent
          {...this.props}
          isMobile={isMobile}
        />
      );
    }
  };
}

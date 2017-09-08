import React, { Component } from 'react'

const MOBILE_WIDTH = 480;

export default function withIsMobile(SomeComponent) {
  return class extends Component {
    constructor() {
      super();
      this.state = {
        isMobile: window.innerWidth <= MOBILE_WIDTH,
      };
    }

    componentWillMount() {
      window.addEventListener('resize', this.handleWindowSizeChange);
    }

    componentWillUnmount() {
      window.removeEventListener('resize', this.handleWindowSizeChange);
    }

    handleWindowSizeChange = () => {
      this.setState({ isMobile: window.innerWidth <= MOBILE_WIDTH });
    };

    render() {
      const { isMobile } this.state;

      this.state = {
        width: window.innerWidth,
      };
      return (
        <SomeComponent
          {...this.props}
          isMobile={isMobile}
        />
      );
    }
  }
}

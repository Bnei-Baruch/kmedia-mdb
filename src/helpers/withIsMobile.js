import React, { Component } from 'react'

const MOBILE_WIDTH = 768;

export default function withIsMobile(SomeComponent) {
  return class extends Component {
    constructor() {
      super();
      this.state = {
        isMobile: this.width() <= MOBILE_WIDTH,
      };
    }

    width() {
      return document.documentElement.clientWidth;
    }

    componentDidMount() {
      this._isMounted = true;
      window.addEventListener('resize', this.handleWindowSizeChange);
      this.handleWindowSizeChange();
    }

    componentWillUnmount() {
      window.removeEventListener('resize', this.handleWindowSizeChange);
      this._isMounted = false;
    }

    handleWindowSizeChange = () => {
      if (this._isMounted && this.state.isMobile !== (this.width() <= MOBILE_WIDTH)) {
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
  }
}

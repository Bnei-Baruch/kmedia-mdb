/* This component __HAVE__ to be __BEFORE__ content */
import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Button, Visibility, } from 'semantic-ui-react';

class BackToTop extends Component {
  static propTypes = {
    isRTL: PropTypes.bool.isRequired,
    offset: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.string,
      PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.number, PropTypes.string]))
    ]),
  };

  static defaultProps = {
    offset: [0, 0],
  };

  static isBrowser() {
    return (typeof window !== 'undefined' && window.document);
  }

  state = { backToTop: false };

  handleUpdate = (e, { calculations: { topVisible } }) => {
    const topInvisible = !topVisible;
    if (this.state.backToTop !== topInvisible) {
      this.setState({ backToTop: topInvisible });
    }
  };

  backToTop = () => {
    window.scrollTo(0, 0);
  };

  render() {
    const style = this.props.isRTL ?
      {
        position: 'fixed',
        left: 50,
        bottom: 70
      } : {
        position: 'fixed',
        right: 50,
        bottom: 70
      };

    return (
      <Fragment>
        <Visibility
          onUpdate={this.handleUpdate}
          offset={this.props.offset}
          fireOnMount
        />
        {
          this.state.backToTop &&
          <Button
            basic
            size="tiny"
            icon="arrow up"
            onClick={this.backToTop}
            style={style}
          />
        }
      </Fragment>
    );
  }
}

export default BackToTop;

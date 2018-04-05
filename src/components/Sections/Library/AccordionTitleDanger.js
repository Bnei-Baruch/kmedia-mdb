import React, { Component } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import _ from 'lodash';
import noop from 'lodash/noop';
import { Icon, } from 'semantic-ui-react';

// Stolen from SemanticUI
export const useKeyOnly = (val, key) => val && key;
const getUnhandledProps = (ComponentFunc, props) => {
  const { handledProps = [] } = ComponentFunc;

  return Object.keys(props).reduce((acc, prop) => {
    if (prop === 'childKey') {
      return acc;
    }
    if (handledProps.indexOf(prop) === -1) {
      acc[prop] = props[prop];
    }
    return acc;
  }, {});
};

function getElementType(ComponentFunc, props, getDefault) {
  const { defaultProps = {} } = ComponentFunc;
  if (props.as && props.as !== defaultProps.as) {
    return props.as;
  }
  if (getDefault) {
    const computedDefault = getDefault();
    if (computedDefault) {
      return computedDefault;
    }
  }
  if (props.href) {
    return 'a';
  }

  return defaultProps.as || 'div';
}

class AccordionTitleDanger extends Component {
  static propTypes = {
    /** An element type to render as (string or function). */
    as: PropTypes.oneOfType([
      PropTypes.func,
      PropTypes.string,
      PropTypes.symbol,
    ]),

    /** Whether or not the title is in the open state. */
    active: PropTypes.bool,

    /** Primary content. */
    children: PropTypes.node,

    /** Additional classes. */
    className: PropTypes.string,

    /** Shorthand for primary content. */
    // eslint-disable-next-line react/forbid-prop-types
    content: PropTypes.object,

    /** AccordionTitle index inside Accordion. */
    index: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]),

    /**
     * Called on click.
     *
     * @param {SyntheticEvent} event - React's original SyntheticEvent.
     * @param {object} data - All props.
     */
    onClick: PropTypes.func,

    match: PropTypes.bool,
  };

  static defaultProps = {
    as: 'div',
    active: false,
    children: null,
    className: '',
    content: null,
    match: false,
    index: 0,
    onClick: noop,
  };

  static handledProps = ['active', 'as', 'children', 'className', 'content', 'index', 'onClick', 'match'];

  handleClick = e => _.invoke(this.props, 'onClick', e, this.props);

  render() {
    const { active, children, className, content, match } = this.props;

    const classes     = cx(
      useKeyOnly(active && !match, 'active'),
      'title',
      className,
    );
    const rest        = getUnhandledProps(AccordionTitleDanger, this.props);
    const ElementType = getElementType(AccordionTitleDanger, this.props);

    if (_.isNil(content)) {
      if (typeof children === 'string') {
        return (<ElementType {...rest} className={classes} onClick={this.handleClick} dangerouslySetInnerHTML={{ __html: children }} />);
      } else {
        return (<ElementType {...rest} className={classes} onClick={this.handleClick}>{children}</ElementType>);
      }
    }

    return (
      <ElementType {...rest} className={classes} onClick={this.handleClick}>
        <Icon name="dropdown" />
        {content}
      </ElementType>
    );
  }
}

export default AccordionTitleDanger;

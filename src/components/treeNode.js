import React from 'react';
// import PropTypes from 'prop-types';

import classNames from 'classnames';

class TreeNode extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: true
    };
  }

  toggle = () => {
    this.setState({ visible: !this.state.visible });
  };

  description = (name, description) => {
    if (name) {
      return ` (${name})`;
    }
    if (description) {
      return ` (${description})`;
    }
    return '';
  };

  render() {
    const node = this.props.node;

    let childNodes = null;
    let classObj   = null;

// eslint-disable-next-line no-extra-boolean-cast
    if (!!node.children) {
      childNodes = node.children.map(item => <li key={`${item.id}-c`}><TreeNode node={item} /></li>);

      classObj = {
        togglable       : true,
        'togglable-down': this.state.visible,
        'togglable-up'  : !this.state.visible,
      };
    }

    const style = this.state.visible ? {} : { display: 'none' };

    return (
      <div>
        <a key={node.code} onClick={this.toggle} className={classNames(classObj)}>{node.name}
          {this.description(node.full_name, node.description)}
        </a>
        <ul style={style}>{childNodes}</ul>
      </div>
    );
  }
}

// TreeNode.propTypes = {};

export default TreeNode;

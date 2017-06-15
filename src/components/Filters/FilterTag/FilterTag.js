import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Label, Icon } from 'semantic-ui-react';

class FilterTag extends PureComponent {
  static propTypes = {
    icon: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    onClose: PropTypes.func.isRequired,
    onClick: PropTypes.func.isRequired,
    isActive: PropTypes.bool
  };

  static defaultProps = {
    isActive: false
  };

  handleClick = (event) => {
    this.props.onClick();
  };

  handleClose = (event) => {
    event.stopPropagation();
    this.props.onClose();
  };

  render() {
    const { icon, label, onClose, onClick, isActive } = this.props;
    const color = isActive ? 'green' : 'blue';

    return (
      <Label as="a" ref={el => this.label = el} onClick={this.handleClick} color={color}>
        <Icon name={icon} />
        {label}
        <Icon name="close" onClick={this.handleClose} />
      </Label>
    );
  }
}

export default FilterTag;

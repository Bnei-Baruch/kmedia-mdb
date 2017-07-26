import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Button, Icon } from 'semantic-ui-react';

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

  handleClick = () => {
    this.props.onClick();
  };

  handleClose = (event) => {
    event.stopPropagation();
    this.props.onClose();
  };

  render() {
    const { icon, label, isActive } = this.props;
    const color                     = isActive ? 'green' : 'blue';

    return (
      <Button.Group size="mini">
        <Button basic as="a" color={color} onClick={this.handleClick} ref={el => this.label = el}>
          <Icon name={icon} />
          {label}
        </Button>
        <Button color={color} icon="close" onClick={this.handleClose} />
      </Button.Group>
    );
  }
}

export default FilterTag;

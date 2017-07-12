import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Icon, Button } from 'semantic-ui-react';

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
    const { icon, label, isActive } = this.props;
    const color = isActive ? 'green' : 'blue';

    return (
      <Button.Group size='mini'>
        <Button basic as="a" ref={el => this.label = el} onClick={this.handleClick} color={color}>
          <Icon name={icon}/>
          {label}
        </Button>
        <Button color={color} icon='close' onClick={this.handleClose}>
        </Button>
      </Button.Group>
    );
  }
}

export default FilterTag;

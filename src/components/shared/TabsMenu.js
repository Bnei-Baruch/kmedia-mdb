import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { Menu } from 'semantic-ui-react';

class TabsMenu extends Component {

  static propTypes = {
    items: PropTypes.arrayOf(PropTypes.shape({
      name: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      component: PropTypes.node.isRequired,
    })),
    active: PropTypes.string,
  };

  static defaultProps = {
    items: [],
    active: '',
  };

  constructor(props) {
    super(props);

    let { active } = props;
    if (!active) {
      active = this.activeFromLocation(props);
    }

    if (!active) {
      active = this.activeFromDefault(props);
    }

    this.state = { active };
  }

  activeFromLocation = (props) => {
    const { location }                       = props;
    const { state: { active: active } = {} } = location;
    return active;
  };

  activeFromDefault = (props) => {
    const { items } = props;
    let active;
    if (items.length > 0) {
      active = items[0].name;
    }
    return active;
  };

  componentWillReceiveProps(nextProps) {
    const { active } = nextProps;
    if (active !== this.props.active) {
      this.setState({ active });
    }
  }

  handleActiveChange = (e, { name }) => this.setState({ active: name });

  render() {
    const { active } = this.state;
    const { items }  = this.props;
    const activeItem = items.find(x => x.name === active);

    return (
      <div className="tabs-menu">
        <Menu secondary pointing color="blue">
          {
            items.map((item) => {
              const { name, label } = item;
              return (
                <Menu.Item
                  key={name}
                  name={name}
                  className={`tab-${name}`}
                  active={active === name}
                  onClick={this.handleActiveChange}
                >
                  {label}
                </Menu.Item>
              );
            })
          }
        </Menu>
        {activeItem.component}
      </div>
    );
  }
}

export default withRouter(TabsMenu);

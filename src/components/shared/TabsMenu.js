import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { Menu } from 'semantic-ui-react';

import * as shapes from '../shapes';

class TabsMenu extends Component {
  static propTypes = {
    location: shapes.HistoryLocation.isRequired,
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

    const active = props.active
      || this.activeFromLocation(props.location)
      || this.activeFromDefault(props.items);
    this.state   = { active };
  }

  componentDidUpdate(prevProps){
    const { active } = this.props;
    if (active !== prevProps.active) {
      this.setState({ active });
    }
  }

  activeFromLocation = (location) => {
    const { state: { active } = {} } = location;
    return active;
  };

  activeFromDefault = items => (items.length > 0 ? items[0].name : null);

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

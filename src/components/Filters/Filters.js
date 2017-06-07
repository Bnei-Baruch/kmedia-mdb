import React  from 'react';
import PropTypes from 'prop-types';
import find from 'lodash/find';
import { Menu } from 'semantic-ui-react';

const filterPropShape = PropTypes.shape({
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  component: PropTypes.any.isRequired
});

class Filter extends React.Component {

  static propTypes = {
    namespace: PropTypes.string.isRequired,
    onFilterApplication: PropTypes.func.isRequired,
    filters: PropTypes.arrayOf(filterPropShape).isRequired
  };

  state = {
    activeFilter: null,
    sourcesSelection: [],
  };

  handleFilterClick = ({ name }) => this.setState({ activeFilter: name });

  handleCancelActiveFilter = () => {
    this.setState({ activeFilter: null });
  }

  handleApplyActiveFilter = () => {
    this.props.onFilterApplication();
  };

  render() {
    const activeFilter = this.state.activeFilter;

    return (
      <div>
        <FilterMenu items={this.props.filters} active={activeFilter} onChoose={this.handleFilterClick} />
        <ActiveFilter
          namespace={this.props.namespace}
          activeFilterName={activeFilter}
          filters={this.props.filters}
          onCancel={() => this.handleCancelActiveFilter()}
          onApply={() => this.handleApplyActiveFilter()}
        />
      </div>
    );
  }
}

export default Filter;

const ActiveFilter = ({ activeFilterName, filters, onCancel, onApply, ...rest }) => {
  const activeFilter = find(filters, filter => filter.name === activeFilterName);

  if (!activeFilter) {
    return null;
  }

  const { component: Component } = activeFilter;
  return (
    <Component onCancel={onCancel} onApply={onApply} {...rest} />
  );
};

ActiveFilter.propTypes = {
  filters: PropTypes.arrayOf(filterPropShape).isRequired,
  activeFilterName: PropTypes.string,
  onCancel: PropTypes.func.isRequired,
  onApply: PropTypes.func.isRequired
};

ActiveFilter.defaultProps = {
  activeFilterName: null
};

const FilterMenuItem = ({ name, label, isActive, onChoose }) => (
  <Menu.Item name={name} active={isActive} onClick={() => onChoose({ name })}>{label}</Menu.Item>
);

FilterMenuItem.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  isActive: PropTypes.bool,
  onChoose: PropTypes.func,
};

FilterMenuItem.defaultProps = {
  isActive: false,
  onChoose: undefined
};

const FilterMenu = (props) => {
  const { items, active, onChoose } = props;
  return (
    <Menu secondary pointing color="blue" className="index-filters" size="large">
      {
        items.map(item => (
          <FilterMenuItem
            key={item.name}
            name={item.name}
            label={item.label}
            isActive={item.name === active}
            onChoose={onChoose}
          />
        ))
      }
    </Menu>
  );
};

FilterMenu.propTypes = {
  items: PropTypes.arrayOf(filterPropShape).isRequired,
  active: PropTypes.string,
  onChoose: PropTypes.func
};

FilterMenu.defaultProps = {
  active: '',
  onChoose: undefined
}

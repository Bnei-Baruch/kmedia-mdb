import React  from 'react';
import PropTypes from 'prop-types';
import { Segment, Menu as RMenu } from 'semantic-ui-react';
import DateFilter from './DateFilter/DateFilter';
import SourcesFilter from './SourcesFilter/SourcesFilter';

class Filter extends React.Component {

  static propTypes = {
    namespace: PropTypes.string.isRequired,
    onFilterApplication: PropTypes.func.isRequired
  };

  state = {
    activeFilter: null,
    sourcesSelection: []
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
        <FilterMenu active={activeFilter} handler={this.handleFilterClick} />
        <ActiveFilter
          namespace={this.props.namespace}
          filter={activeFilter}
          onCancel={() => this.handleCancelActiveFilter()}
          onApply={() => this.handleApplyActiveFilter()}
        />
      </div>
    );
  }
}

export default Filter;

const ActiveFilter = ({ filter, onCancel, onApply, ...rest }) => {
  switch (filter) {
  case 'date-filter':
    return <DateFilter onCancel={onCancel} onApply={onApply} {...rest} />;
  case 'sources-filter':
    return <SourcesFilter onCancel={onCancel} onApply={onApply} {...rest} />;
  case 'topic-filter':
    return <Segment basic attached="bottom" className="tab active">Third</Segment>;
  default:
    return <span />;
  }
};

ActiveFilter.propTypes = {
  filter: PropTypes.string,
  onCancel: PropTypes.func.isRequired,
  onApply: PropTypes.func.isRequired
};

ActiveFilter.defaultProps = {
  filter: null
};



const FilterMenu = props =>
  (
    <RMenu secondary pointing color="blue" className="index-filters" size="large">
      <FilterMenuDate name="date" title="Date" {...props} />
      <FilterMenuSources name="sources" title="Sources" {...props} />
      <FilterMenuTopics name="topic" title="Topics" {...props} />
    </RMenu>
  )
;

const FilterMenuDate = ({ name, title, active, handler }) => {
  const fullName = `${name}-filter`;
  return (
    <RMenu.Item name={fullName} active={active === fullName} onClick={() => handler({ name: fullName })}>{title}</RMenu.Item>
  );
};

FilterMenuDate.propTypes = {
  name   : PropTypes.string.isRequired,
  title  : PropTypes.string.isRequired,
  active : PropTypes.string,
  handler: PropTypes.func,
};

const FilterMenuSources = ({ name, title, active, handler }) => {
  const fullName = `${name}-filter`;
  return (
    <RMenu.Item name={fullName} active={active === fullName} onClick={() => handler({ name: fullName })}>{title}</RMenu.Item>
  );
};

FilterMenuSources.propTypes = {
  name   : PropTypes.string.isRequired,
  title  : PropTypes.string.isRequired,
  active : PropTypes.string,
  handler: PropTypes.func,
};

const FilterMenuTopics = ({ name, title, active, handler }) => {
  const fullName = `${name}-filter`;
  return (
    <RMenu.Item name={fullName} active={active === fullName} onClick={() => handler({ name: fullName })}>{title}</RMenu.Item>
  );
};

FilterMenuTopics.propTypes = {
  name   : PropTypes.string.isRequired,
  title  : PropTypes.string.isRequired,
  active : PropTypes.string,
  handler: PropTypes.func,
};

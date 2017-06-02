import React  from 'react';
import PropTypes from 'prop-types';
import DateFilter from './DateFilter/DateFilter';
import SourcesFilter from './SourcesFilter/SourcesFilter';

import { Segment, Menu as RMenu } from 'semantic-ui-react';

export default class Filter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeFilter: null
    };
  }

  handleFilterClick = ({ name }) => this.setState({ activeFilter: name });

  handleFilterHide = () => this.setState({ activeFilter: null });

  render() {
    const activeFilter = this.state.activeFilter;

    return (
      <div>
        <FilterMenu active={activeFilter} handler={this.handleFilterClick} />
        <ActiveFilter filter={activeFilter} onCancel={() => this.handleFilterHide()} />
      </div>
    );
  }
}

const ActiveFilter = ({ filter, onCancel }) => {
  switch (filter) {
  case 'date-filter':
    return <DateFilter onCancel={onCancel} />;
  case 'sources-filter':
    return <SourcesFilter onCancel={onCancel} />;
  case 'topic-filter':
    return <Segment basic attached="bottom" className="tab active">Third</Segment>;
  default:
    return <span />;
  }
};

ActiveFilter.propTypes = {
  filter: PropTypes.string.isRequired,
  onCancel: PropTypes.func
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

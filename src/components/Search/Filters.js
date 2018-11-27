import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import { Dropdown, Menu, Button, Icon } from 'semantic-ui-react';

import { getQuery } from '../../helpers/url';
import { actions, selectors } from '../../redux/modules/filters';
import * as shapes from '../shapes';
import Filters from '../Filters/Filters';
import filterComponents from '../Filters/components';

const filters = [
  {
    name: 'date-filter',
    component: filterComponents.DateFilter,
  },
  {
    name: 'topics-filter',
    component: filterComponents.TopicsFilter,
  },
  {
    name: 'sources-filter',
    component: filterComponents.SourcesFilter,
  },
  {
    name: 'language-filter',
    component: filterComponents.LanguageFilter,
  },
];

class SearchResultsFilters extends Component {
  static propTypes = {
    location: shapes.HistoryLocation.isRequired,
    sortBy: PropTypes.string.isRequired,
    onSortByChange: PropTypes.func.isRequired,
    onHydrated: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
    filtersValues: PropTypes.objectOf(PropTypes.object).isRequired,
    setFilterValue: PropTypes.func.isRequired,
    isMobileDevice: PropTypes.func.isRequired,
    t: PropTypes.func.isRequired,
  };

  state = { isShowFilters: false };

  componentDidMount() {
    if (getQuery(this.props.location).section) {
      this.setState({ isShowFilters: true });
    }
  }

  showFilters = () =>
    this.setState({ isShowFilters: !this.state.isShowFilters });

  onSelectionChange = (section) => {
    const sValue = section !== 'all' ? `filters.sections-filter.${section}` : '';
    this.props.setFilterValue('search', 'sections-filter', sValue);
    this.props.onChange();
  };

  getActiveFilterTab = () => {
    const query = getQuery(this.props.location).section;
    return !query ? 'all' : query.split('.').slice(-1)[0] || 'all';
  };

  renderTabs = () => {
    const { t, filtersValues, sortBy, onSortByChange, isMobileDevice } = this.props;

    const options = ['relevance', 'newertoolder', 'oldertonewer'].map(o => ({
      text: t(`search.sorts.${o}`),
      value: o,
    }));

    const sortingDisabled =
            (filtersValues.values || []).some(f =>
              f.name === 'sections-filter' &&
              f.values &&
              f.values.includes('filters.sections-filter.sources'));

    const orderFilters = isMobileDevice() ? null : (
      <Menu.Item>
        <span key="span" style={{ padding: '10px' }}>
          {t('search.sortby')}:
          &nbsp;&nbsp;
          <Dropdown
            inline
            disabled={sortingDisabled}
            key="dropdown"
            options={options}
            value={sortBy}
            onChange={onSortByChange}
          />
        </span>
      </Menu.Item>
    );

    const activeTab = this.getActiveFilterTab();
    const tabs      = (
      <Menu.Menu className="overflow_auto">
        {
          ['all', 'lessons', 'programs', 'sources', 'events', 'publications']
            .map(x => (
              <Menu.Item
                key={x}
                content={t(`filters.sections-filter.${x}`)}
                active={x === activeTab}
                onClick={() => this.onSelectionChange(x)}
              />
            ))}
      </Menu.Menu>
    );

    const rightButtons = (
      <Menu.Menu position="right">
        <Menu.Item>
          <Button
            basic
            className="show_filters"
            active={this.state.isShowFilters}
            onClick={this.showFilters}
          >
            {isMobileDevice() ? null : <span>{t('filters.filters')}&nbsp;&nbsp;</span>}
            <Icon name="filter" fitted />
          </Button>
        </Menu.Item>
        {orderFilters}
      </Menu.Menu>
    );

    return <Menu borderless className="section_tabs">{tabs}{rightButtons}</Menu>;
  };

  render() {
    const { onHydrated, onChange, t } = this.props;

    const hideFilters = (
      <Menu.Item key="hideFilters">
        {t('filters.hideFilters')}&nbsp;&nbsp;
        <Button circular basic icon="close" size="small" onClick={this.showFilters} />
      </Menu.Item>
    );

    return (
      <div>
        {this.renderTabs()}
        {
          <div style={{ display: this.state.isShowFilters ? 'block' : 'none' }}>
            <Filters
              className="searchFilters"
              namespace="search"
              filters={filters}
              onChange={onChange}
              rightItems={[hideFilters]}
              onHydrated={onHydrated}
            />
          </div>
        }
      </div>
    );
  }
}

export default connect(
  state => ({
    filtersValues: selectors.getNSFilters(state.filters, 'search') || {},
  }),
  disptach => bindActionCreators({
    setFilterValue: actions.setFilterValue
  }, disptach)
)(translate()(SearchResultsFilters));

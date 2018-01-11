import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { List, Table } from 'semantic-ui-react';

import { CT_VIDEO_PROGRAM_CHAPTER } from '../../../helpers/consts';
import { canonicalLink } from '../../../helpers/utils';
import { CollectionsBreakdown } from '../../../helpers/mdb';
import { actions as filtersActions, selectors as filters } from '../../../redux/modules/filters';
import {
  mapDispatch as baseMapDispatch,
  mapState as baseMapState,
  UnitListContainer,
  wrap
} from '../../Pages/UnitList/Container';
import Link from '../../Language/MultiLanguageLink';
import UnitLogo from '../../shared/Logo/UnitLogo';
import SectionHeader from '../../shared/SectionHeader';

export const renderUnit = (unit, t) => {
  const breakdown = new CollectionsBreakdown(Object.values(unit.collections || {}));
  const programs  = breakdown.getPrograms();

  const relatedItems = programs.map(x =>
    (
      <List.Item key={x.id} as={Link} to={canonicalLink(x)}>
        {x.name || '☠ no name'}
      </List.Item>
    )
  ).concat(breakdown.getAllButPrograms().map(x => (
    <List.Item key={x.id} as={Link} to={canonicalLink(x)}>
      {x.name}
    </List.Item>
  )));

  let filmDate = '';
  if (unit.film_date) {
    filmDate = t('values.date', { date: new Date(unit.film_date) });
  }

  return (
    <Table.Row key={unit.id} verticalAlign="top">
      <Table.Cell collapsing singleLine width={1}>
        <strong>{filmDate}</strong>
      </Table.Cell>
      <Table.Cell collapsing width={1}>
        <UnitLogo
          fluid
          unitId={unit.id}
          collectionId={programs.length > 0 ? programs[0].id : null}
        />
      </Table.Cell>
      <Table.Cell>
        <Link to={canonicalLink(unit)}>
          <strong>{unit.name || '☠ no name'}</strong>
        </Link>
        <List className="index-list__item-subtitle" horizontal divided link size="tiny">
          <List.Item>
            <List.Header>{t('programs.list.episode_from')}</List.Header>
          </List.Item>
          {relatedItems}
        </List>
      </Table.Cell>
    </Table.Row>
  );
};

class MyUnitListContainer extends UnitListContainer {

  static propTypes = {
    ...UnitListContainer.propTypes,
    shouldOpenProgramsFilter: PropTypes.bool,
    editNewFilter: PropTypes.func.isRequired,
  };

  static defaultProps = {
    ...UnitListContainer.defaultProps,
    shouldOpenProgramsFilter: true,
  };

  handleFiltersHydrated() {
    super.handleFiltersHydrated();
    if (this.props.shouldOpenProgramsFilter) {
      this.props.editNewFilter('programs', 'programs-filter');
    }
  };

}

const mapState = (state, ownProps) => {
  // we want to open programs-filter if no filter is applied
  const allFilters               = filters.getFilters(state.filters, ownProps.namespace);
  const shouldOpenProgramsFilter = allFilters.length === 0;

  return {
    ...baseMapState(state, ownProps),
    shouldOpenProgramsFilter
  };
};

function mapDispatch(dispatch) {
  return {
    ...baseMapDispatch(dispatch),
    ...bindActionCreators({
      editNewFilter: filtersActions.editNewFilter,
    }, dispatch),
  };
}

const MyUnitList = wrap(MyUnitListContainer, mapState, mapDispatch);

class ProgramsList extends Component {

  extraFetchParams = () => {
    return { content_type: [CT_VIDEO_PROGRAM_CHAPTER] };
  };

  render() {
    return (
      <div>
        <SectionHeader section="programs" />
        <MyUnitList
          namespace="programs"
          renderUnit={renderUnit}
          extraFetchParams={this.extraFetchParams}
        />
      </div>
    );
  }
}

export default ProgramsList;

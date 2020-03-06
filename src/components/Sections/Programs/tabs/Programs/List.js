import React from 'react';
import { Table } from 'semantic-ui-react';

import { CT_VIDEO_PROGRAM_CHAPTER } from '../../../../../helpers/consts';
import * as renderUnitHelper from '../../../../../helpers/renderUnitHelper';
import UnitList from '../../../../Pages/UnitList/Container';
import { FrownSplash } from '../../../../shared/Splash/Splash';

const renderUnit = (unit, t) => {
  if (!unit) {
    return <FrownSplash text={t('messages.source-content-not-found')} />;
  }

  const breakdown = renderUnitHelper.getUnitCollectionsBreakdown(unit);
  const programs  = breakdown.getPrograms();

  const relatedItems = programs
    .map(x => renderUnitHelper.renderUnitNameAsListItem(x))
    .concat(breakdown.getAllButPrograms()
      .map(x => renderUnitHelper.renderUnitNameAsListItem(x)));

  return (
    <Table.Row key={unit.id} verticalAlign="top">
      <Table.Cell collapsing singleLine>
        { renderUnitHelper.renderUnitCollectionLogo(unit, 'programs', programs.length > 0 ? programs[0].id : null)}
      </Table.Cell>
      <Table.Cell>
        { renderUnitHelper.renderUnitFilmDate(unit, t) }
        { renderUnitHelper.renderUnitNameLink(unit) }
        { renderUnitHelper.renderUnitDescription(unit) }
        { renderUnitHelper.renderRelatedItems(relatedItems, t('programs.list.episode_from')) }
      </Table.Cell>
    </Table.Row>
  );
};

const extraFetchParams = () => ({
  content_type: [CT_VIDEO_PROGRAM_CHAPTER]
});

const ProgramsList = () => 
  <div>
    <UnitList
      namespace="programs-main"
      renderUnit={renderUnit}
      extraFetchParams={extraFetchParams}
    />
  </div>

export default ProgramsList;

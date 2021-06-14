import React from 'react';
import { Table } from 'semantic-ui-react';

import { CT_CLIP } from '../../../../../helpers/consts';
import * as renderUnitHelper from '../../../../../helpers/renderUnitHelper';
import UnitList from '../../../../Pages/UnitList/Container';

const renderUnit = (unit, t) => {
  if (!unit) {
    return null;
  }
  const { clips, relatedItems }
          = renderUnitHelper.commonRenderUnitForClips(unit, t);
  return <Table.Row key={unit.id} verticalAlign="top">
    <Table.Cell collapsing singleLine>
      {renderUnitHelper.renderUnitCollectionLogo(unit, 'clips', clips.length > 0 ? clips[0].id : null)}
    </Table.Cell>
    <Table.Cell>
      {renderUnitHelper.renderUnitFilmDate(unit, t)}
      {renderUnitHelper.renderUnitNameLink(unit)}
      {renderUnitHelper.renderUnitDescription(unit)}
      {renderUnitHelper.renderRelatedItems(relatedItems, t('programs.list.item_of'))}
    </Table.Cell>
  </Table.Row>;
};

const ClipsList = () =>
  <UnitList
    key="programs-clips"
    namespace="programs-clips"
    renderUnit={renderUnit}
    extraFetchParams={{ content_type: CT_CLIP }}
  />;

export default ClipsList;

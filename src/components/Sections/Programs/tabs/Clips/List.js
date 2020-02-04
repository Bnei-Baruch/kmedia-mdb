import React from 'react';
import { List, Table } from 'semantic-ui-react';

import { CT_CLIP } from '../../../../../helpers/consts';
import * as renderUnitHelper from '../../../../../helpers/renderUnitHelper';
import UnitList from '../../../../Pages/UnitList/Container';

const renderUnit = (unit, t) => {
  const {
    clips,
    relatedItems
  } = renderUnitHelper.commonRenderUnitForClips(unit, t);

  return (
    <Table.Row key={unit.id} verticalAlign="top">
      <Table.Cell collapsing singleLine>
        { renderUnitHelper.renderUnitCollectionLogo(unit, 'clips', clips.length > 0 ? clips[0].id : null)}
      </Table.Cell>
      <Table.Cell>
        { renderUnitHelper.renderUnitFilmDate(unit, t) }
        { renderUnitHelper.renderUnitNameLink(unit) }
        { renderUnitHelper.renderUnitDescription(unit) }

        <List horizontal divided link className="index__collections" size="tiny">
          <List.Item>
            <List.Header>{t('programs.list.item_of')}</List.Header>
          </List.Item>
          {relatedItems}
        </List>
      </Table.Cell>
    </Table.Row>
  );
};

const extraFetchParams = () => ({
  content_type: [CT_CLIP]
});

const ClipsList = () => 
  <div>
    <UnitList
      namespace="programs-clips"
      renderUnit={renderUnit}
      extraFetchParams={extraFetchParams}
    />
  </div>

export default ClipsList;

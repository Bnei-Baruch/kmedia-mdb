import React from 'react';
import { Table } from 'semantic-ui-react';

import { CT_BLOG_POST } from '../../../../../helpers/consts';
import * as renderUnitHelper from '../../../../../helpers/renderUnitHelper';
import UnitList from '../../../../Pages/UnitList/Container';

const renderUnit = (unit, t) => 
  (
    <Table.Row key={unit.id} verticalAlign="top" className="no-thumbnail">
      <Table.Cell collapsing singleLine>
        { renderUnitHelper.renderUnitFilmDate(unit, t)}
      </Table.Cell>
      <Table.Cell>
        { renderUnitHelper.renderUnitNameLink(unit)}
        { renderUnitHelper.renderUnitDescription(unit)}
      </Table.Cell>
    </Table.Row>
  );

const AudioBlogList = () => {
  const extraFetchParams = () => ({ content_type: [CT_BLOG_POST] });

  return (
    <div>
      <UnitList
        namespace="publications-audio-blog"
        extraFetchParams={extraFetchParams}
        renderUnit={renderUnit}
      />
    </div>
  );
};

export default AudioBlogList;

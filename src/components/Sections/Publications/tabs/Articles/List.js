import React from 'react';
import { Table } from 'semantic-ui-react';

import { CT_ARTICLE } from '../../../../../helpers/consts';
import * as renderUnitHelper from '../../../../../helpers/renderUnitHelper';
import UnitList from '../../../../Pages/UnitList/Container';

const renderUnit = (unit, t) => {
  const breakdown    = renderUnitHelper.getUnitCollectionsBreakdown(unit);
  const articles     = breakdown.getArticles();
  const relatedItems = articles.map(renderUnitHelper.renderUnitNameAsListItem);

  return (
    <Table.Row key={unit.id} verticalAlign="top" className="no-thumbnail">
      <Table.Cell collapsing singleLine>
        {renderUnitHelper.renderUnitFilmDate(unit, t)}
      </Table.Cell>
      <Table.Cell>
        {renderUnitHelper.renderUnitNameLink(unit)}
        {renderUnitHelper.renderUnitDescription(unit)}
        {renderUnitHelper.renderRelatedItems(relatedItems, t('publications.list.item_from'))}
      </Table.Cell>
    </Table.Row>
  );
};

const ArticlesList = () =>
  <UnitList
    key="publications-articles"
    namespace="publications-articles"
    extraFetchParams={{ content_type: CT_ARTICLE }}
    renderUnit={renderUnit}
  />
;

export default ArticlesList;

import React from 'react';
import { Table } from 'semantic-ui-react';
import * as renderUnitHelper from '../../../helpers/renderUnitHelper';
import { useSelector } from 'react-redux';
import { selectors as mdb } from '../../../../lib/redux/slices/mdbSlice';
import { useTranslation } from 'next-i18next';

const ArticleFeed = ({ id }) => {
  const { t }        = useTranslation();
  const unit         = useSelector(state => mdb.getDenormContentUnit(state.mdb, id));
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
export default ArticleFeed;

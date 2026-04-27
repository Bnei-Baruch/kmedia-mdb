import React from 'react';

import { CT_ARTICLE } from '../../../../../helpers/consts';
import * as renderUnitHelper from '../../../../../helpers/renderUnitHelper';
import UnitList from '../../../../Pages/UnitListAsTable/Container';

const renderUnit = (unit, t) => {
  if (!unit) return null;

  const breakdown    = renderUnitHelper.getUnitCollectionsBreakdown(unit);
  const articles     = breakdown.getArticles();
  const relatedItems = articles.map(renderUnitHelper.renderUnitNameAsListItem);

  return (
    <tr key={unit.id} className="align-top no-thumbnail">
      <td className="whitespace-nowrap w-px">
        {renderUnitHelper.renderUnitFilmDate(unit, t)}
      </td>
      <td>
        {renderUnitHelper.renderUnitNameLink(unit)}
        {renderUnitHelper.renderUnitDescription(unit)}
        {renderUnitHelper.renderRelatedItems(relatedItems, t('publications.list.item_from'))}
      </td>
    </tr>
  );
};

const ArticlesList = () =>
  <UnitList
    key="publications-articles"
    namespace="publications-articles"
    extraFetchParams={{ content_type: CT_ARTICLE }}
    renderUnit={renderUnit}
  />;
export default ArticlesList;

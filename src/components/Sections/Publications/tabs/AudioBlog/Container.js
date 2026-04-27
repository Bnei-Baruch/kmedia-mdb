import React from 'react';

import { CT_BLOG_POST } from '../../../../../helpers/consts';
import * as renderUnitHelper from '../../../../../helpers/renderUnitHelper';
import UnitList from '../../../../Pages/UnitListAsTable/Container';

const renderUnit = (unit, t) => {
  if (!unit) return null;

  return (
    <tr key={unit.id} className="align-top no-thumbnail">
      <td className="whitespace-nowrap w-px">
        {renderUnitHelper.renderUnitFilmDate(unit, t)}
      </td>
      <td>
        {renderUnitHelper.renderUnitNameLink(unit)}
        {renderUnitHelper.renderUnitDescription(unit)}
      </td>
    </tr>
  );
};

const AudioBlogList = () =>
  <UnitList
    key="publications-audio-blog"
    namespace="publications-audio-blog"
    extraFetchParams={{ content_type: CT_BLOG_POST }}
    renderUnit={renderUnit}
  />;

export default AudioBlogList;

import React from 'react';
import PropTypes from 'prop-types';

import * as renderUnitHelper from '../../../../../helpers/renderUnitHelper';
import * as shapes from '../../../../shapes';

const renderUnit = (unit, t) => {
  const {
    clips,
    relatedItems
  } = renderUnitHelper.commonRenderUnitForClips(unit, t);

  return (
    <tr key={unit.id} className="align-top">
      <td className="whitespace-nowrap">
        { renderUnitHelper.renderUnitCollectionLogo(unit, 'clips', clips.length > 0 ? clips[0].id : null)}
      </td>
      <td>
        { renderUnitHelper.renderUnitFilmDate(unit, t) }
        { renderUnitHelper.renderUnitNameLink(unit) }
        { renderUnitHelper.renderUnitDescription(unit) }
        {
          relatedItems &&
          <ul className="index__collections list-none flex gap-2 divide-x text-xs p-0">
            {relatedItems}
          </ul>
        }
      </td>
    </tr>
  );
};

const DerivedUnits = ({ selectedUnits, t }) =>
  <table className="index w-full">
    <tbody>
      {selectedUnits.map(u => renderUnit(u, t))}
    </tbody>
  </table>;

DerivedUnits.propTypes = {
  selectedUnits: PropTypes.arrayOf(shapes.ContentUnit).isRequired,
  t: PropTypes.func.isRequired,
};

export default DerivedUnits;

import React from 'react';

import * as renderUnitHelper from '../../../../../helpers/renderUnitHelper';
import Collection from '../../../../Pages/Collection/Container';

const PublicationCollection = () => <Collection namespace="publications-collection" renderUnit={renderUnit} />;

const renderUnit = (unit, t) =>
  (
    <tr key={unit.id} className="align-top">
      <td className="whitespace-nowrap w-px">
        { renderUnitHelper.renderUnitFilmDate(unit, t)}
      </td>
      <td>
        { renderUnitHelper.renderUnitNameLink(unit)}
        { renderUnitHelper.renderUnitDescription(unit)}
      </td>
    </tr>
  );

export default PublicationCollection;

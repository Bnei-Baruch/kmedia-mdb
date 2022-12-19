import React from 'react';
import PropTypes from 'prop-types';
import { List, Table } from 'semantic-ui-react';

import * as renderUnitHelper from '../../../../../helpers/renderUnitHelper';
import * as shapes from '../../../../shapes';


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
        {
          relatedItems &&
          <List horizontal divided link className="index__collections" size="tiny">
            {relatedItems}
          </List>
        }
      </Table.Cell>
    </Table.Row>
  );
};

const DerivedUnits = ({ selectedUnits, t }) =>
  <Table unstackable basic="very" className="index" sortable>
    <Table.Body>
      {selectedUnits.map(u => renderUnit(u, t))}
    </Table.Body>
  </Table>;

DerivedUnits.propTypes = {
  selectedUnits: PropTypes.arrayOf(shapes.ContentUnit).isRequired,
  t: PropTypes.func.isRequired,
};

export default DerivedUnits;

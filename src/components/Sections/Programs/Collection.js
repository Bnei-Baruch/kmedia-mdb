import React from 'react';
import { Table } from 'semantic-ui-react';

import * as renderUnitHelper from '../../../helpers/renderUnitHelper';
import Collection from '../../Pages/Collection/Container';

const renderUnit = (unit, t) =>
  <Table.Row key={unit.id} verticalAlign="top">
    <Table.Cell collapsing singleLine>
      { renderUnitHelper.renderUnitLogo(unit, 'programs')}
    </Table.Cell>
    <Table.Cell>
      { renderUnitHelper.renderUnitFilmDate(unit, t) }
      { renderUnitHelper.renderUnitNameLink(unit) }
      { renderUnitHelper.renderUnitDescription(unit) }
    </Table.Cell>
  </Table.Row>

const ProgramCollection = () =>
  <Collection namespace="programs-collection" renderUnit={renderUnit} />;

export default ProgramCollection;

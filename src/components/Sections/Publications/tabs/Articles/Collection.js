import React from 'react';
import { Table } from 'semantic-ui-react';

import * as renderUnitHelper from '../../../../../helpers/renderUnitHelper';
import Collection from '../../../../Pages/Collection/Container';

const PublicationCollection = () => <Collection namespace="publications-collection" renderUnit={renderUnit} />;

const renderUnit = (unit, t) =>
  (
    <Table.Row key={unit.id} verticalAlign="top">
      <Table.Cell collapsing singleLine>
        { renderUnitHelper.renderUnitFilmDate(unit, t)}
      </Table.Cell>
      <Table.Cell>
        { renderUnitHelper.renderUnitNameLink(unit)}
        { renderUnitHelper.renderUnitDescription(unit)}
      </Table.Cell>
    </Table.Row>
  );

export default PublicationCollection;

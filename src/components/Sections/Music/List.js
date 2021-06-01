import React from 'react';
import PropTypes from 'prop-types';
import { Table } from 'semantic-ui-react';
import isEqual from 'react-fast-compare';

import { NO_NAME } from '../../../helpers/consts';
import { canonicalLink } from '../../../helpers/links';
// import { fromToLocalized } from '../../../helpers/date';
import * as shapes from '../../shapes';
import Link from '../../Language/MultiLanguageLink';

const renderCollection = collection => {
  const { id, name } = collection;
  // const localDate = start_date && end_date
  //   ? fromToLocalized(start_date, end_date)
  //   : undefined;

  return (
    <Table.Row className="no-thumbnail" verticalAlign="top" key={id}>
      {/* {
        localDate &&
      <Table.Cell collapsing singleLine>
        <span className="index__date">{localDate}</span>
      </Table.Cell>
      } */}
      <Table.Cell>
        <Link className="index__title" to={canonicalLink(collection)}>
          {name || NO_NAME}
        </Link>
      </Table.Cell>
    </Table.Row>
  );
};

const MusicList = ({ items = [] }) => {
  if (!Array.isArray(items) || items.length === 0) {
    return null;
  }

  return (
    <Table unstackable basic="very" className="index">
      <Table.Body>
        {items.map(renderCollection)}
      </Table.Body>
    </Table>
  );
};

MusicList.propTypes = {
  items: PropTypes.arrayOf(shapes.GenericCollection),
};

const areEqual = (prevProps, nextProps) => isEqual(prevProps.items, nextProps.items);

export default React.memo(MusicList, areEqual);

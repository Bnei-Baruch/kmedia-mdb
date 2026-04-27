import React from 'react';
import PropTypes from 'prop-types';
import isEqual from 'react-fast-compare';

import { NO_NAME } from '../../../helpers/consts';
import { canonicalLink } from '../../../helpers/links';
import * as shapes from '../../shapes';
import Link from '../../Language/MultiLanguageLink';

const renderCollection = collection => {
  const { id, name } = collection;

  return (
    <tr className="no-thumbnail align-top" key={id}>
      <td>
        <Link className="index__title" to={canonicalLink(collection)}>
          {name || NO_NAME}
        </Link>
      </td>
    </tr>
  );
};

const MusicList = ({ items = [] }) => {
  if (!Array.isArray(items) || items.length === 0) {
    return null;
  }

  return (
    <table className="w-full index">
      <tbody>
        {items.map(renderCollection)}
      </tbody>
    </table>
  );
};

MusicList.propTypes = {
  items: PropTypes.arrayOf(shapes.GenericCollection),
};

const areEqual = (prevProps, nextProps) => isEqual(prevProps.items, nextProps.items);

export default React.memo(MusicList, areEqual);

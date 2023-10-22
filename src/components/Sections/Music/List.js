import React from 'react';
import { Table } from 'semantic-ui-react';
import Link from 'next/link';
import { useSelector } from 'react-redux';

import { NO_NAME } from '../../../helpers/consts';
import { canonicalLink } from '../../../helpers/links';
import { selectors } from '../../../../lib/redux/slices/musicSlice/musicSlice';
import { selectors as mdb } from '../../../../lib/redux/slices/mdbSlice';

const MusicItem = ({ id }) => {
  const c = useSelector(state => mdb.getDenormCollection(state.mdb, id));

  return (
    <Table.Row className="no-thumbnail" verticalAlign="top" key={id}>
      <Table.Cell>
        <Link className="index__title" href={canonicalLink(c)}>
          {c.name || NO_NAME}
        </Link>
      </Table.Cell>
    </Table.Row>
  );
};

const MusicList = () => {
  const items = useSelector(state => selectors.getMusicData(state.music));
  return (
    <Table unstackable basic="very" className="index">
      <Table.Body>
        {
          items.map((id) => <MusicItem id={id} key={id} />)
        }
      </Table.Body>
    </Table>
  );
};
export default MusicList;

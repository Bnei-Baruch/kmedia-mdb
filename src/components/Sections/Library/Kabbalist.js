import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { Header, Image, List, Table } from 'semantic-ui-react';

import * as shapes from '../../shapes';
import NavLink from '../../Language/MultiLanguageNavLink';
import portraitBS from '../../../images/portrait_bs.png';
import portraitRB from '../../../images/portrait_rb.png';
import portraitML from '../../../images/portrait_ml.png';
import { useSelector } from 'react-redux';
import { selectors as sources } from '../../../../lib/redux/slices/sourcesSlice';
import Link from 'next/link';

const portraits = { bs: portraitBS, rb: portraitRB, ml: portraitML };

const mapLinks = {
  ar: 'ari',
  bs: 'baal-hasulam',
  ml: 'michael-laitman',
  rb: 'rabash',
  rh: 'rashbi',
};

const renderBook = book => {
  const { id, name, description } = book;
  return (
    <List.Item
      key={id}
      as={Link}
      href={{ pathname: `/sources/${id}`, state: { tocIsActive: true, }, }}
    >
      {name}
      {description ? ` - ${description}` : ''}
    </List.Item>
  );
};

const Kabbalist = ({ id }) => {
  const getSourceById = useSelector(state => sources.getSourceById(state.sources));

  const { name, full_name: fullName, children: volumes } = getSourceById(id);
  const portrait                                         = portraits[id];

  let displayName = fullName || name;
  if (fullName && name) {
    displayName += ` (${name})`;
  }

  const kabbalist = mapLinks[id];

  return (
    <Table.Row verticalAlign="top" className={clsx({ author: true, 'author--image': !!portrait })}>
      <Table.Cell collapsing width={2}>
        {portrait ? <Image src={portrait.src} alt={fullName} /> : null}
      </Table.Cell>
      <Table.Cell>
        <div>
          <div className="sources__list">
            <Header size="small">
              {kabbalist ? <Link href={`/persons/${kabbalist}`} title={fullName}>{displayName}</Link> : displayName}
            </Header>
            <div>
              <List bulleted>
                {
                  volumes
                    ? volumes.map(x => (renderBook(getSourceById(x))))
                    : null
                }
              </List>
            </div>
          </div>
        </div>
      </Table.Cell>
    </Table.Row>
  );
};
export default Kabbalist;

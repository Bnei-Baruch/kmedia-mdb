import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { Header, Image, List, Table } from 'semantic-ui-react';

import * as shapes from '../../shapes';
import NavLink from '../../Language/MultiLanguageNavLink';

const mapLinks = {
  ar: 'ari',
  bs: 'baal-hasulam',
  ml: 'michael-laitman',
  rb: 'rabash',
  rh: 'rashbi',
};

const renderBook = (book) => {
  const { id, name, description } = book;
  return (
    <List.Item key={id}>
      <NavLink to={{
        pathname: `/sources/${id}`,
        state: {
          tocIsActive: true,
        },
      }}
      >
        {name}
        {description ? ` - ${description}` : ''}
      </NavLink>
    </List.Item>
  );
};

const Kabbalist = ({ author: { name, full_name: fullName, children: volumes, id }, getSourceById, portrait }) => {
  let displayName = fullName || name;
  if (fullName && name) {
    displayName += ` (${name})`;
  }

  const kabbalist = mapLinks[id];

  return (
    <Table.Row verticalAlign="top" className={classnames({ author: true, 'author--image': !!portrait })}>
      <Table.Cell collapsing width={2}>
        {portrait ? <Image src={portrait} alt={fullName} /> : null}
      </Table.Cell>
      <Table.Cell>
        <div>
          <div className="sources__list">
            <Header size="small">
              {kabbalist ? <NavLink to={`/persons/${kabbalist}`} title={fullName}>{displayName}</NavLink> : displayName}
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

Kabbalist.propTypes = {
  getSourceById: PropTypes.func.isRequired,
  author: shapes.Author.isRequired,
  portrait: PropTypes.string,
};

Kabbalist.defaultProps = {
  portrait: '',
};

export default Kabbalist;

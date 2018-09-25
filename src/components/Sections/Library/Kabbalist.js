import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { Header, Image, List, Table } from 'semantic-ui-react';

import * as shapes from '../../shapes';
import NavLink from '../../Language/MultiLanguageNavLink';

class Kabbalist extends Component {

  static mapLinks = {
    ar: 'ari',
    bs: 'baal-hasulam',
    ml: 'michael-laitman',
    rb: 'rabash',
    rh: 'rashbi',
  };

  static propTypes = {
    getSourceById: PropTypes.func.isRequired,
    author: shapes.Author.isRequired,
    portrait: PropTypes.string,
  };

  static defaultProps = {
    portrait: '',
  };

  renderBook = (book) => {
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
          {name} {description ? ` - ${description}` : ''}
        </NavLink>
      </List.Item>
    );
  };

  render() {
    const { author: { name, full_name: fullName, children: volumes, id }, getSourceById, portrait } = this.props;

    let displayName = fullName || name;
    if (fullName && name) {
      displayName += ` (${name})`;
    }

    const kabbalist = Kabbalist.mapLinks[id];

    return (
      <Table.Row verticalAlign="top" className={classnames({'author':true, 'author--image': !!portrait })}>
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
                    volumes ?
                      volumes.map(x => (this.renderBook(getSourceById(x)))) :
                      null
                  }
                </List>
              </div>
            </div>
          </div>
        </Table.Cell>
      </Table.Row>
    );
  }
}

export default Kabbalist;

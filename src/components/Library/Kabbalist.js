import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Image, Container, Table, List, Header } from 'semantic-ui-react';

import NavLink from '../Language/MultiLanguageNavLink';

class Kabbalist extends Component {
  static propTypes = {
    getSourceById: PropTypes.func.isRequired,
    items: PropTypes.shape({
      id: PropTypes.string,
      name: PropTypes.string,
      full_name: PropTypes.string,
      children: PropTypes.arrayOf(PropTypes.string),
    }).isRequired,
  };

  book = (hex, getSourceById) => {
    const { id, name, description } = getSourceById(hex);
    return (
      <List.Item key={id}>
        <NavLink
          
          to={`/sources/${id}`}
          >
          {`${name} ${description || ''} `}
        </NavLink>
      </List.Item>
    );
  };

  render() {
    const { items, getSourceById, placeholder }                         = this.props;
    const { name, full_name: fullName, children: volumes } = items;

    let displayName = fullName || name;
    if (fullName && name) {
      displayName += ` (${name})`;
    }
 
    return (
      
        <Table.Row verticalAlign='top'>
          <Table.Cell collapsing width={2}>
            <Image fluid src={placeholder} />
          </Table.Cell>
          <Table.Cell>
            <Header size='small'>{displayName}</Header>
            <List bulleted horizontal>
              {volumes && volumes.map(hex => (this.book(hex, getSourceById)))}
            </List>
          </Table.Cell>
        </Table.Row>
        
      
    );
  }
}

export default Kabbalist;

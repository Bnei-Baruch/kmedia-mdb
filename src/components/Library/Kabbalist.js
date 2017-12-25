import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Image } from 'semantic-ui-react';
import placeholder from '../shared/placeholder.png';
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
      <NavLink
        key={id}
        to={`/sources/${id}`}
        style={{ paddingRight: '20px' }}
      >
        {`${name} ${description || ''} `}
      </NavLink>
    );
  };

  render() {
    const { items, getSourceById }                         = this.props;
    const { name, full_name: fullName, children: volumes } = items;

    let displayName = fullName || name;
    if (fullName && name) {
      displayName += ` (${name})`;
    }

    return (
      <div>
        <Image style={{ height: '150px', width: '100px' }} verticalAlign="top" inline src={placeholder} />
        <span style={{ textTransform: 'uppercase' }}>{displayName}</span>
        <br />
        {volumes && volumes.map(hex => (this.book(hex, getSourceById)))}
      </div>
    );
  }
}

export default Kabbalist;

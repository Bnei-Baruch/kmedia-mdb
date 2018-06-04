import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { selectors } from '../../../redux/modules/publications';
import FlatListFilter from './FlatListFilter';

class PublishersFilter extends React.Component {
  static propTypes = {
    publisherById: PropTypes.objectOf(PropTypes.object).isRequired,
  };

  render() {
    const { publisherById, ...rest } = this.props;

    const options = Object.values(publisherById).map(x => ({
      text: x.name,
      value: x.id,
    }));

    return (
      <FlatListFilter options={options} {...rest} />
    );
  }
}

export default connect(
  state => ({
    publisherById: selectors.getPublisherById(state.publications),
  }),
)(PublishersFilter);

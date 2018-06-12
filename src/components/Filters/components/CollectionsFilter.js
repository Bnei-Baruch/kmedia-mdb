import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { CT_LECTURE_SERIES, CT_VIRTUAL_LESSONS } from '../../../helpers/consts';
import { strCmp } from '../../../helpers/utils';
import { selectors } from '../../../redux/modules/lessons';
import { selectors as mdb } from '../../../redux/modules/mdb';
import * as shapes from '../../shapes';
import FlatListFilter from './FlatListFilter';

class CollectionsFilter extends React.Component {
  static propTypes = {
    collections: PropTypes.arrayOf(shapes.GenericCollection).isRequired,
  };

  render() {
    const { collections, ...rest } = this.props;

    const options = collections.map(x => ({
      text: x.name,
      value: x.id,
    }));
    options.sort((a, b) => strCmp(a.text, b.text));

    return (
      <FlatListFilter name="collections-filter" options={options} {...rest} />
    );
  }
}

export default connect(
  (state, ownProps) => {
    const { namespace } = ownProps;
    const ct            = namespace === 'lessons-virtual' ? CT_VIRTUAL_LESSONS : CT_LECTURE_SERIES;
    const cIDs          = selectors.getLecturesByType(state.lessons)[ct];

    return {
      collections: (cIDs || []).map(x => mdb.getCollectionById(state.mdb, x)),
    };
  },
)(CollectionsFilter);

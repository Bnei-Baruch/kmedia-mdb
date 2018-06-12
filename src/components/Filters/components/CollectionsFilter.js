import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { CT_LECTURE_SERIES, CT_VIRTUAL_LESSONS } from '../../../helpers/consts';
import { strCmp } from '../../../helpers/utils';
import { selectors } from '../../../redux/modules/lessons';
import { selectors as mdb } from '../../../redux/modules/mdb';
import * as shapes from '../../shapes';
import HierarchicalFilter from './HierarchicalFilter';

class CollectionsFilter extends React.Component {
  static propTypes = {
    collections: PropTypes.arrayOf(shapes.GenericCollection).isRequired,
  };

  constructor(props) {
    super(props);
    this.state = { tree: this.getTree(this.props) };
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.collections !== nextProps.collections) {
      this.setState({ tree: this.getTree(nextProps) });
    }
  }

  getTree = (props) => {
    const { collections, t } = props;

    collections.sort((a, b) => strCmp(a.name, b.name));

    return [
      {
        value: 'root',
        text: t('filters.collections-filter.all'),
        children: collections.map(x => ({
          text: x.name,
          value: x.id,
        }))
      }
    ];
  };

  render() {
    const { tree } = this.state;
    return <HierarchicalFilter name="collections-filter" tree={tree} {...this.props} />;
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

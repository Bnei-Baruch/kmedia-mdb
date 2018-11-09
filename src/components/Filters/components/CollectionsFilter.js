import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { CT_LECTURE_SERIES, CT_VIRTUAL_LESSONS, CT_CLIPS } from '../../../helpers/consts';
import { strCmp } from '../../../helpers/utils';
import { selectors as lessons } from '../../../redux/modules/lessons';
import { selectors as programs } from '../../../redux/modules/programs';
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
    let ct;
    let cIDs;

    switch (namespace) {
    case 'lessons-virtual':
      ct = CT_VIRTUAL_LESSONS;
      cIDs = lessons.getLecturesByType(state.lessons)[ct];
      break;
    case 'lessons-lectures':
      ct = CT_LECTURE_SERIES;
      cIDs = lessons.getLecturesByType(state.lessons)[ct];
      break;
    case 'programs-clips':
      ct = CT_CLIPS;
      cIDs = programs.getProgramsByType(state.programs)[ct];
      break;
    default:
      break;
    }

    return {
      collections: (cIDs || []).map(x => mdb.getCollectionById(state.mdb, x)),
    };
  },
)(CollectionsFilter);

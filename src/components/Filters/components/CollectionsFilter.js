import React from 'react';
import PropTypes from 'prop-types';
import { withNamespaces } from 'react-i18next';
import { connect } from 'react-redux';

import { CT_ARTICLES, CT_CLIPS, CT_LECTURE_SERIES, CT_VIDEO_PROGRAM, CT_VIRTUAL_LESSONS } from '../../../helpers/consts';
import { strCmp } from '../../../helpers/utils';
import { selectors as lessons } from '../../../redux/modules/lessons';
import { selectors as programs } from '../../../redux/modules/programs';
import { selectors as publications } from '../../../redux/modules/publications';
import { selectors as mdb } from '../../../redux/modules/mdb';
import * as shapes from '../../shapes';
import HierarchicalFilter from './HierarchicalFilter';

class CollectionsFilter extends React.Component {
  static propTypes = {
    collections: PropTypes.arrayOf(shapes.GenericCollection).isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      tree: CollectionsFilter.getTree(this.props),
      collections: null,
    };
  }

  componentDidUpdate(prevProps) {
    const { collections } = this.props;
    if (collections !== prevProps.collections) {
      this.setState({ collections });
    }
  }

  static getDerivedStateFromProps(props, state) {
    const { collections } = state;
    if (collections !== props.collections) {
      return { tree: CollectionsFilter.getTree(props), collections: props.collections };
    }
    return null;
  }

  static getTree = (props) => {
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

const nsMap = new Map([
  ['lessons-virtual', [CT_VIRTUAL_LESSONS, lessons.getLecturesByType, 'lessons']],
  ['lessons-lectures', [CT_LECTURE_SERIES, lessons.getLecturesByType, 'lessons']],
  ['programs-main', [CT_VIDEO_PROGRAM, programs.getProgramsByType, 'programs']],
  ['programs-clips', [CT_CLIPS, programs.getProgramsByType, 'programs']],
  ['publications-articles', [CT_ARTICLES, publications.getCollections, 'publications']],
]);
export default connect(
  (state, ownProps) => {
    const { namespace }        = ownProps;
    const [ct, cIDsFunc, kind] = nsMap.get(namespace);

    const cIDs = ct ? cIDsFunc(state[kind])[ct] : null;

    return {
      collections: (cIDs || []).map(x => mdb.getCollectionById(state.mdb, x)),
    };
  },
)(withNamespaces()(CollectionsFilter));

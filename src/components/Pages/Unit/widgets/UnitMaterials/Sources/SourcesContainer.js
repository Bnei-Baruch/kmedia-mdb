import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { isEmpty } from '../../../../../../helpers/utils';
import { selectors } from '../../../../../../redux/modules/sources';
import { actions as assetsActions, selectors as assetsSelectors } from '../../../../../../redux/modules/assets';
import { selectors as settings } from '../../../../../../redux/modules/settings';
import * as shapes from '../../../../../shapes';
import Sources from './Sources';

class SourcesContainer extends Component {
  static propTypes = {
    unit: shapes.ContentUnit.isRequired,
    indexMap: PropTypes.objectOf(shapes.DataWipErr),
    content: shapes.DataWipErr,
    doc2htmlById: PropTypes.objectOf(shapes.DataWipErr),
    language: PropTypes.string.isRequired,
    t: PropTypes.func.isRequired,
    fetchIndex: PropTypes.func.isRequired,
    fetchAsset: PropTypes.func.isRequired,
    getSourceById: PropTypes.func.isRequired,
    doc2html: PropTypes.func.isRequired,
  };

  static defaultProps = {
    indexMap: {},
    content: {
      data: null,
      wip: false,
      err: null,
    },
    doc2htmlById: {},
  };

  componentDidMount() {
    this.fetchIndices(this.props);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.unit.sources !== this.props.unit.sources) {
      this.fetchIndices(nextProps);
    }
  }

  fetchIndices = (props) => {
    const { indexMap, fetchIndex } = props;
    Object.entries(indexMap).forEach(([k, v]) => {
      if (isEmpty(v)) {
        fetchIndex(k);
      }
    });
  };

  handleContentChange = (id, name, deriveId) => {
    if (deriveId) {
      this.props.doc2html(deriveId);
    } else {
      this.props.fetchAsset(`sources/${id}/${name}`);
    }
  };

  render() {
    const { unit, indexMap, content, doc2htmlById, language, t, getSourceById } = this.props;

    return (
      <Sources
        unit={unit}
        indexMap={indexMap}
        content={content}
        doc2htmlById={doc2htmlById}
        defaultLanguage={language}
        t={t}
        getSourceById={getSourceById}
        onContentChange={this.handleContentChange}
      />
    );
  }
}

export default connect(
  (state, ownProps) => {
    const indexById = assetsSelectors.getSourceIndexById(state.assets);
    const indexMap  = (ownProps.unit.sources || []).reduce((acc, val) => {
      acc[val] = indexById[val];
      return acc;
    }, {});

    return {
      indexMap,
      content: assetsSelectors.getAsset(state.assets),
      doc2htmlById: assetsSelectors.getDoc2htmlById(state.assets),
      language: settings.getLanguage(state.settings),
      getSourceById: selectors.getSourceById(state.sources),
    };
  },
  dispatch => bindActionCreators({
    doc2html: assetsActions.doc2html,
    fetchIndex: assetsActions.sourceIndex,
    fetchAsset: assetsActions.fetchAsset,
  }, dispatch)
)(SourcesContainer);

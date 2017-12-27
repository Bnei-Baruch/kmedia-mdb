import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';

import { actions as sourceActions, selectors as sources } from '../../redux/modules/sources';
import { selectors as settings } from '../../redux/modules/settings';
import Kabbalist from './Kabbalist';

class Homepage extends Component {
  static propTypes = {
    roots: PropTypes.arrayOf(PropTypes.string).isRequired,
    getSourceById: PropTypes.func.isRequired,
    t: PropTypes.func.isRequired,
  };

  render() {
    const { roots, getSourceById } = this.props;
    
    const kabbalists = roots.map(k =>
      <Kabbalist key={k} items={getSourceById(k)} getSourceById={getSourceById} />
    );

    return (
      <div>
        <h1>{this.props.t('sources-library.title')}</h1>
        {kabbalists}
      </div>
    );
  }
}

export default connect(
  state => ({
    language: settings.getLanguage(state.settings),
    indexMap: sources.getIndexById(state.sources),
    roots: sources.getRoots(state.sources),
    getSourceById: sources.getSourceById(state.sources),
  }),
  dispatch => bindActionCreators({
    fetchIndex: sourceActions.fetchIndex,
  }, dispatch)
)(translate()(Homepage));

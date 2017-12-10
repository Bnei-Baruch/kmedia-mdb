import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';

import { actions as sourceActions, selectors as sources } from '../../redux/modules/sources';
import { selectors as settings } from '../../redux/modules/settings';

class Kabbalist extends Component {
  static propTypes = {};

  static defaultProps = {};

  render() {
    const { items, getSubItemById }              = this.props;
    const { name, full_name: fullName, children: volumes } = items;

    return (
      <div>
        <picture>Img</picture>
        <h2>{fullName}({name})</h2>
        {volumes && volumes.map(hex => (<a key={hex}>{hex}</a>))}
      </div>
    );
  }
}

class Homepage extends Component {
  static propTypes = {
    roots: PropTypes.arrayOf(PropTypes.string).isRequired,
    getSubItemById: PropTypes.func.isRequired,
  };

  static defaultProps = {};

  render() {
    const { roots, getSubItemById } = this.props;
    const kabbalists                = roots.map(k =>
      <Kabbalist key={k} items={getSubItemById(k)} getSubItemById={getSubItemById} />
    );

    return (
      <div>
        <h1>Kabbalah Sources</h1>
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
    getSubItemById: sources.getSourceById(state.sources),
  }),
  dispatch => bindActionCreators({
    fetchIndex: sourceActions.fetchIndex,
  }, dispatch)
)(translate()(Homepage));

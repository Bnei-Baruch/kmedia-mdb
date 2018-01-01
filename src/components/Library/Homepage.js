import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import { Divider, Table, Container } from 'semantic-ui-react';
import SectionHeader from '../shared/SectionHeader';

import { actions as sourceActions, selectors as sources } from '../../redux/modules/sources';
import { selectors as settings } from '../../redux/modules/settings';
import Kabbalist from './Kabbalist';
import placeholder1 from '../shared/portrait1.png';
import placeholder2 from '../shared/portrait2.png';
import placeholder3 from '../shared/portrait3.png';
class Homepage extends Component {
  static propTypes = {
    roots: PropTypes.arrayOf(PropTypes.string).isRequired,
    getSourceById: PropTypes.func.isRequired,
    t: PropTypes.func.isRequired,
  };

  render() {
    const { roots, getSourceById } = this.props;
    const placeholders =[placeholder1, placeholder2, placeholder3];
    let placeholderIndex = 0;
    const kabbalists = roots.map(k =>
      
      <Kabbalist key={k} items={getSourceById(k)} getSourceById={getSourceById} placeholder={placeholders[placeholderIndex++]} />
    );

    return (
      <div>
        <SectionHeader section="sources-library" />
        <Divider fitted />
        <Container className="padded">
          <Table basic="very" sortable className="index-list">
            <Table.Body>
              {kabbalists}
            </Table.Body>
          </Table>
        </Container>
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

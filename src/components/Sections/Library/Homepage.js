import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import { Container, Divider, Table } from 'semantic-ui-react';

import { actions as sourceActions, selectors as sources } from '../../../redux/modules/sources';
import { selectors as settings } from '../../../redux/modules/settings';
import SectionHeader from '../../shared/SectionHeader';
import Kabbalist from './Kabbalist';
import portraitBS from '../../../images/portrait_bs.png';
import portraitRB from '../../../images/portrait_rb.png';
import portraitML from '../../../images/portrait_ml.png';

class Homepage extends Component {
  static propTypes = {
    roots: PropTypes.arrayOf(PropTypes.string).isRequired,
    getSourceById: PropTypes.func.isRequired,
    t: PropTypes.func.isRequired,
  };

  render() {
    const { roots, getSourceById } = this.props;
    const placeholders             = [portraitBS, portraitRB, portraitML];
    let placeholderIndex           = 0;
    const kabbalists               = roots.map(k => (
        <Kabbalist
          key={k}
          author={getSourceById(k)}
          getSourceById={getSourceById}
          placeholder={placeholders[placeholderIndex++]}
        />
      )
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

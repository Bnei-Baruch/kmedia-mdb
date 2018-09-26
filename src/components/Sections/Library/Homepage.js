import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import { Container, Divider, Table } from 'semantic-ui-react';

import { isEmpty } from '../../../helpers/utils';
import { selectors as sources } from '../../../redux/modules/sources';
import SectionHeader from '../../shared/SectionHeader';
import Kabbalist from './Kabbalist';
import portraitBS from '../../../images/portrait_bs.png';
import portraitRB from '../../../images/portrait_rb.png';
import portraitML from '../../../images/portrait_ml.png';

class Homepage extends Component {
  static propTypes = {
    roots: PropTypes.arrayOf(PropTypes.string).isRequired,
    getSourceById: PropTypes.func.isRequired,
  };

  static portraits = [portraitBS, portraitRB, portraitML];

  static kabbalists = ({ roots, getSourceById }) => {
    let portraitIndex = 0;

    return roots.map((kabbalist) => {
      const author = getSourceById(kabbalist);

      return isEmpty(author.children) ?
        null :
        <Kabbalist
          key={kabbalist}
          author={author}
          getSourceById={getSourceById}
          portrait={Homepage.portraits[portraitIndex++]}
        />;
    }).filter(x => x); // remove nulls
  };

  render() {
    const { roots, getSourceById } = this.props;

    return (
      <div>
        <SectionHeader section="sources-library" />
        <Divider fitted />
        <Container className="padded">
          <Table basic="very" className="index-list sources__authors">
            <Table.Body>
              {Homepage.kabbalists({ roots, getSourceById })}
            </Table.Body>
          </Table>
        </Container>
      </div>
    );
  }
}

export default connect(
  state => ({
    roots: sources.getRoots(state.sources),
    getSourceById: sources.getSourceById(state.sources),
  })
)(translate()(Homepage));

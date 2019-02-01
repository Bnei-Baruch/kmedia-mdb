import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Container, Divider, Table } from 'semantic-ui-react';

import { isEmpty } from '../../../helpers/utils';
import { selectors as sources } from '../../../redux/modules/sources';
import SectionHeader from '../../shared/SectionHeader';
import Kabbalist from './Kabbalist';
import portraitBS from '../../../images/portrait_bs.png';
import portraitRB from '../../../images/portrait_rb.png';
import portraitML from '../../../images/portrait_ml.png';

const portraits = { bs: portraitBS, rb: portraitRB, ml: portraitML };

const renderKabbalists = ({ roots, getSourceById }) => (
  roots.map(
    (k) => {
      const author = getSourceById(k);

      return isEmpty(author.children)
        ? null
        : (
          <Kabbalist
            key={author.id}
            author={author}
            getSourceById={getSourceById}
            portrait={portraits[k]}
          />);
    }
  )
);

const Homepage = (props) => {
  const { roots, getSourceById } = props;

  return (
    <div>
      <SectionHeader section="sources-library" />
      <Divider fitted />
      <Container className="padded">
        <Table basic="very" className="index-list sources__authors">
          <Table.Body>
            {renderKabbalists({ roots, getSourceById })}
          </Table.Body>
        </Table>
      </Container>
    </div>
  );
};

Homepage.propTypes = {
  roots: PropTypes.arrayOf(PropTypes.string).isRequired,
  getSourceById: PropTypes.func.isRequired,
};

export default connect(
  state => ({
    roots: sources.getRoots(state.sources),
    getSourceById: sources.getSourceById(state.sources),
  })
)(Homepage);

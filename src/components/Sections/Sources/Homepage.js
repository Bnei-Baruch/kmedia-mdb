import React from 'react';
import { useSelector } from 'react-redux';
import { Container, Divider, Table } from 'semantic-ui-react';

import { isEmpty } from '../../../helpers/utils';
import SectionHeader from '../../shared/SectionHeader';
import Kabbalist from './Kabbalist';
import { sourcesGetRootsSelector, sourcesGetSourceByIdSelector } from '../../../redux/selectors';

const Homepage = () => {
  const roots         = useSelector(sourcesGetRootsSelector);
  const getSourceById = useSelector(sourcesGetSourceByIdSelector);

  return (
    <div>
      <SectionHeader section="sources-library"/>
      <Divider fitted/>
      <Container className="padded">
        <Table basic="very" className="index-list sources__authors">
          <Table.Body>
            {
              roots.map(r => {
                const author = getSourceById(r);

                return !isEmpty(author.children) &&
                  <Kabbalist
                    key={author.id}
                    author={author}
                    getSourceById={getSourceById}
                    portraitIdx={r}
                  />;
              })
            }
          </Table.Body>
        </Table>
      </Container>
    </div>
  );
};

export default Homepage;

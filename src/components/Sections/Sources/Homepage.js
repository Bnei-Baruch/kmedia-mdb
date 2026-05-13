import React from 'react';
import { useSelector } from 'react-redux';

import { isEmpty } from '../../../helpers/utils';
import SectionHeader from '../../shared/SectionHeader';
import Kabbalist from './Kabbalist';
import { sourcesGetRootsSelector, sourcesGetSourceByIdSelector } from '../../../redux/selectors';

const Homepage = () => {
  const roots = useSelector(sourcesGetRootsSelector);
  const getSourceById = useSelector(sourcesGetSourceByIdSelector);

  return (
    <div>
      <SectionHeader section="sources-library" />
      <div className="flex flex-col p-4">
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
      </div>
    </div>
  );
};

export default Homepage;

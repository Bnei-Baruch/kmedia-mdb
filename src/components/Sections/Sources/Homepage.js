import React from 'react';
import { useSelector } from 'react-redux';

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
      <hr className="m-0"/>
      <div className=" px-4 ">
        <table className="w-full border-collapse index-list sources__authors">
          <tbody>
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
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Homepage;

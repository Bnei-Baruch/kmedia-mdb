import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { clsx } from 'clsx';
import { useDispatch } from 'react-redux';

import * as shapes from '../../shapes';
import NavLink from '../../Language/MultiLanguageNavLink';
import portraitBS from '../../../images/portrait_bs.png';
import portraitRB from '../../../images/portrait_rb.png';
import portraitML from '../../../images/portrait_ml.png';
import { actions } from '../../../redux/modules/textPage';

const portraits = { bs: portraitBS, rb: portraitRB, ml: portraitML };

const mapLinks = {
  ar: 'ari',
  bs: 'baal-hasulam',
  ml: 'michael-laitman',
  rb: 'rabash',
  rh: 'rashbi',
};

const Kabbalist = ({ author: { name, full_name: fullName, children: volumes, id }, getSourceById, portraitIdx }) => {
  const [portrait, setPortrait] = useState();
  const dispatch                = useDispatch();
  useEffect(() => {
    setPortrait(portraits[portraitIdx]);
  }, [portraitIdx]);

  let displayName = fullName || name;
  if (fullName && name) {
    displayName += ` (${name})`;
  }

  const kabbalist   = mapLinks[id];
  const handleClick = () => dispatch(actions.setTocIsActive(true));

  return (
    <div className={clsx('flex items-start border-b border-gray-300 py-4 last:border-0', { author: true, 'author--image': !!portrait })}>
      <div className="flex-none pr-4">
        {portrait ? <img src={portrait} alt={fullName} /> : null}
      </div>
      <div className="flex-1">
        <div className="sources__list">
          <h4 className="text-lg font-bold mb-2">
            {kabbalist ? <NavLink to={`/persons/${kabbalist}`} title={fullName}>{displayName}</NavLink> : displayName}
          </h4>
          <div>
            <ul className="list-disc pl-5 columns-1 md:columns-2">
              {
                volumes
                  ? volumes.map(x => {
                    const { id: _id, name, description } = getSourceById(x);
                    return (
                      <li key={_id} onClick={handleClick}>
                        <NavLink to={`/sources/${_id}`}>
                          {name}
                          {description ? ` - ${description}` : ''}
                        </NavLink>
                      </li>
                    );
                  }
                  ) : null
              }
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

Kabbalist.propTypes = {
  getSourceById: PropTypes.func.isRequired,
  author: shapes.Author.isRequired,
  index: PropTypes.string,
};

Kabbalist.defaultProps = {
  portrait: '',
};

export default Kabbalist;

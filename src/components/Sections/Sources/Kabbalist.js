import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { Header, Image, List, Table } from 'semantic-ui-react';
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
    <Table.Row verticalAlign="top" className={clsx({ author: true, 'author--image': !!portrait })}>
      <Table.Cell collapsing width={2}>
        {portrait ? <Image src={portrait} alt={fullName} /> : null}
      </Table.Cell>
      <Table.Cell>
        <div>
          <div className="sources__list">
            <Header size="small">
              {kabbalist ? <NavLink to={`/persons/${kabbalist}`} title={fullName}>{displayName}</NavLink> : displayName}
            </Header>
            <div>
              <List bulleted>
                {
                  volumes
                    ? volumes.map(x => {
                        const { id: _id, name, description } = getSourceById(x);
                        return (
                          <List.Item key={_id} onClick={handleClick}>
                            <NavLink to={`/sources/${_id}`}>
                              {name}
                              {description ? ` - ${description}` : ''}
                            </NavLink>
                          </List.Item>
                        );
                      }
                    ) : null
                }
              </List>
            </div>
          </div>
        </div>
      </Table.Cell>
    </Table.Row>
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

import React, { useContext, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Container } from 'semantic-ui-react';
import clsx from 'clsx';
import { DeviceInfoContext } from '../../../helpers/app-contexts';
import UnitLogo from '../Logo/UnitLogo';
import Link from '../../Language/MultiLanguageLink';
import { withNamespaces } from 'react-i18next';
import { canonicalLink } from '../../../helpers/links';
import { useDispatch, useSelector } from 'react-redux';
import { actions, selectors } from '../../../redux/modules/mdb';

const imageWidthBySize = {
  'small': 144,
  'big': 287,
};

const CollectionListTemplate = ({ cID, size = 'big', t }) => {
  const c = useSelector(state => selectors.getDenormCollection(state.mdb, cID));

  const dispatch = useDispatch();
  useEffect(() => {
    if (!c) {
      dispatch(actions.fetchCollection(cID));
    }
  }, [cID, dispatch]);

  const { isMobileDevice } = useContext(DeviceInfoContext);

  if (!c) return null;

  const width       = isMobileDevice ? 165 : imageWidthBySize[size];
  const description = [];
  if (c.film_date) description.push(t('values.date', { date: c.film_date }));

  return (
    <Container
      as={Link}
      to={canonicalLink(c)}
      key={cID}
      className={clsx('cu_item cu_item_list no-thumbnail', { [size]: !!size })}
    >
      <div>
        <div className="cu_item_img" style={{ width }}>
          <UnitLogo collectionId={cID} width={width} />
        </div>
      </div>
      <div className="cu_item_info">
        <div className="cu_item_info_co ">
          <span className="no-padding no-margin text_ellipsis">
            {c.name}
          </span>
        </div>
        <div className={`cu_info_description text_ellipsis`}>
          {description.map((d, i) => (<span key={i}>{d}</span>))}
        </div>
      </div>
    </Container>
  );
};

CollectionListTemplate.propTypes = {
  cID: PropTypes.string
};

export default withNamespaces()(CollectionListTemplate);

import React, { useContext, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Container, Header } from 'semantic-ui-react';
import clsx from 'clsx';
import { DeviceInfoContext } from '../../../src/helpers/app-contexts';
import UnitLogo from '../../../src/components/shared/Logo/UnitLogo';
import Link from '../../../src/components/Language/MultiLanguageLink';
import { withTranslation } from 'next-i18next';
import { canonicalLink } from '../../../src/helpers/links';
import { useDispatch, useSelector } from 'react-redux';
import { actions, selectors } from '../../../lib/redux/slices/mdbSlice/mdbSlice';
import { imageWidthBySize } from './helper';
import { assetUrl } from '../../../src/helpers/Api';
import { fromToLocalized } from '../../../src/helpers/date';

const CollectionListTemplate = ({ cID, size = 'big', t }) => {
  const c = useSelector(state => selectors.getDenormCollection(state.mdb, cID));

  const dispatch = useDispatch();
  useEffect(() => {
    if (!c) {
      dispatch(actions.fetchCollection(cID));
    }
  }, [cID, c, dispatch]);

  const { isMobileDevice } = useContext(DeviceInfoContext);

  if (!c) return null;

  const width       = isMobileDevice ? 165 : imageWidthBySize[size];
  const description = [fromToLocalized(c.start_date, c.end_date)];
  const cuId        = c.cuIDs[0];

  return (
    <Container
      as={Link}
      to={canonicalLink(c)}
      key={cID}
      className={clsx('cu_item cu_item_list no-thumbnail', { [size]: !!size })}
    >
      <div>
        <div className="cu_item_img" style={{ width }}>
          <UnitLogo collectionId={cID} width={width} fallbackImg={cuId && assetUrl(`api/thumbnail/${cuId}`)} />
        </div>
      </div>
      <div className="cu_item_info">

        <Header as={size === 'big' || isMobileDevice ? 'h5' : 'h3'} className="cu_item_name">
          <Header.Content content={c.name} />
          <Header.Subheader content={t(`constants.content-types.${c.content_type}`)} />
        </Header>
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

export default withTranslation()(CollectionListTemplate);

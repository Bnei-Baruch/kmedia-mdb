import React, { useContext, useEffect } from 'react';
import PropTypes from 'prop-types';
import { clsx } from 'clsx';
import { DeviceInfoContext } from '../../../helpers/app-contexts';
import UnitLogo from '../Logo/UnitLogo';
import Link from '../../Language/MultiLanguageLink';
import { useTranslation } from 'react-i18next';
import { canonicalLink } from '../../../helpers/links';
import { useDispatch, useSelector } from 'react-redux';
import { actions as mdbActions } from '../../../redux/modules/mdb';
import { imageWidthBySize } from './helper';
import { assetUrl } from '../../../helpers/Api';
import { fromToLocalized } from '../../../helpers/date';
import { mdbGetDenormCollectionSelector } from '../../../redux/selectors';

const CollectionListTemplate = ({ cID, size = 'big' }) => {
  const { t } = useTranslation();
  const c = useSelector(state => mdbGetDenormCollectionSelector(state, cID));

  const dispatch = useDispatch();
  useEffect(() => {
    if (!c) {
      dispatch(mdbActions.fetchCollection(cID));
    }
  }, [cID, c, dispatch]);

  const { isMobileDevice } = useContext(DeviceInfoContext);

  if (!c) return null;

  const width       = isMobileDevice ? 165 : imageWidthBySize[size];
  const description = [fromToLocalized(c.start_date, c.end_date)];
  const cuId        = c.cuIDs[0];

  const Tag = size === 'big' || isMobileDevice ? 'h5' : 'h3';

  return (
    <Link
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
        <Tag className="cu_item_name">
          <span>{c.name}</span>
          <div className="cu_item_subtext">{t(`constants.content-types.${c.content_type}`)}</div>
        </Tag>
        <div className="cu_info_description text_ellipsis">
          {description.map((d, i) => (<span key={i}>{d}</span>))}
        </div>
      </div>
    </Link>
  );
};

CollectionListTemplate.propTypes = {
  cID: PropTypes.string
};

export default CollectionListTemplate;

import React, { useContext } from 'react';
import { withNamespaces } from 'react-i18next';
import { toHumanReadableTime } from '../../helpers/time';
import { splitPathByLanguage, getQuery, stringify } from '../../helpers/url';
import { DeviceInfoContext } from '../../helpers/app-contexts';
import ShareFormDesktop from './ShareFormDesktop';
import ShareFormMobile from './ShareFormMobile';
import { useLocation } from 'react-router-dom';

const ShareController = () => {

  const { isMobileDevice } = useContext(DeviceInfoContext);
  const location           = useLocation();
  const query    = getQuery(location);


  return (
    <div className="mediaplayer__onscreen-share">
      {isMobileDevice ? <ShareFormDesktop /> : <ShareFormMobile />}
    </div>
  );
};

export default withNamespaces()(ShareFormDesktop);

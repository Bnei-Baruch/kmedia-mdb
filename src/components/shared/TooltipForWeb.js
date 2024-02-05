import React, { useContext } from 'react';
import { useSelector } from 'react-redux';
import { Popup } from 'semantic-ui-react';

import { settingsGetUIDirSelector } from '../../redux/selectors';
import { DeviceInfoContext } from '../../helpers/app-contexts';
import PropTypes from 'prop-types';

const TooltipForWeb = ({ text, trigger }) => {
  const { isMobileDevice } = useContext(DeviceInfoContext);
  const dir                = useSelector(settingsGetUIDirSelector);

  if (isMobileDevice) return trigger;

  return (
    <Popup
      on="hover"
      content={text}
      dir={dir}
      trigger={trigger}
    />
  );
};

TooltipForWeb.propTypes = {
  trigger: PropTypes.elementType.isRequired,
  text: PropTypes.string.isRequired,
};
export default TooltipForWeb;

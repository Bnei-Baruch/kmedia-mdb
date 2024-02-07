import React, { useContext } from 'react';
import { useSelector } from 'react-redux';
import { Popup } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

import { settingsGetUIDirSelector } from '../../../../redux/selectors';
import { DeviceInfoContext } from '../../../../helpers/app-contexts';

const ToolbarBtnTooltip = ({ textKey, trigger }) => {
  const { t } = useTranslation();

  const { isMobileDevice } = useContext(DeviceInfoContext);
  const dir                = useSelector(settingsGetUIDirSelector);

  if (isMobileDevice) {
    return (
      <div className="text_toolbar_btn_with_text">
        {trigger}
        <div>
          {t(`page-with-text.buttons.mobile.${textKey}`)}
        </div>
      </div>
    );
  }

  return (
    <Popup
      on="hover"
      content={t(`page-with-text.buttons.web.${textKey}`)}
      dir={dir}
      trigger={trigger}
    />
  );
};

ToolbarBtnTooltip.propTypes = {
  trigger: PropTypes.elementType.isRequired,
  textKey: PropTypes.string.isRequired,
};
export default ToolbarBtnTooltip;

import React, { useContext } from 'react';
import { useSelector } from 'react-redux';
import { Popup, Button } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

import { settingsGetUIDirSelector, textPageGetFileSelector } from '../../../../redux/selectors';
import { DeviceInfoContext } from '../../../../helpers/app-contexts';

const ToolbarBtnTooltip = ({ textKey, disabled, ...triggerProps }) => {
  const { t } = useTranslation();

  const { isMobileDevice } = useContext(DeviceInfoContext);
  const dir                = useSelector(settingsGetUIDirSelector);
  const noFile             = !useSelector(textPageGetFileSelector);

  disabled = disabled ?? noFile;
  if (isMobileDevice) {
    return (
      <Button
        {...triggerProps}
        className="text_toolbar_btn_with_text"
        disabled={disabled}
        content={
          <span className="title">
            {t(`page-with-text.buttons.mobile.${textKey}`)}
          </span>
        }
      />
    );
  }

  return (
    <Popup
      on="hover"
      content={t(`page-with-text.buttons.web.${textKey}`)}
      dir={dir}
      disabled={disabled}
      trigger={<Button {...triggerProps} disabled={disabled} />}
    />
  );
};

ToolbarBtnTooltip.propTypes = {
  //trigger: PropTypes.elementType.isRequired,
  textKey: PropTypes.string.isRequired,
};
export default ToolbarBtnTooltip;

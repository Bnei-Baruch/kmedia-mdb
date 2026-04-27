import React, { useContext } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

import { settingsGetUIDirSelector, textPageGetFileSelector } from '../../../../redux/selectors';
import { DeviceInfoContext } from '../../../../helpers/app-contexts';

const ToolbarBtnTooltip = ({ textKey, disabled, icon, className: extraClass, active, content, ...rest }) => {
  const { t } = useTranslation();

  const { isMobileDevice } = useContext(DeviceInfoContext);
  const dir                = useSelector(settingsGetUIDirSelector);
  const noFile             = !useSelector(textPageGetFileSelector);

  disabled = disabled ?? noFile;
  if (isMobileDevice) {
    return (
      <button
        {...rest}
        className={`text_toolbar_btn_with_text ${extraClass || ''}`}
        disabled={disabled}
      >
        {icon}
        <span className="title">
          {t(`page-with-text.buttons.mobile.${textKey}`)}
        </span>
      </button>
    );
  }

  return (
    <div className="relative inline-block group">
      <button
        {...rest}
        className={`${extraClass || ''} ${active ? 'active' : ''}`}
        disabled={disabled}
      >
        {icon}
        {content}
      </button>
      {!disabled && (
        <div
          className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block rounded bg-gray-800 px-2 py-1 text-xs text-white whitespace-nowrap z-10 pointer-events-none"
          dir={dir}
        >
          {t(`page-with-text.buttons.web.${textKey}`)}
        </div>
      )}
    </div>
  );
};

ToolbarBtnTooltip.propTypes = {
  textKey: PropTypes.string.isRequired,
};
export default ToolbarBtnTooltip;

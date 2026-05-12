import React, { useContext } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

import { settingsGetUIDirSelector, textPageGetFileSelector } from '../../../../redux/selectors';
import { DeviceInfoContext } from '../../../../helpers/app-contexts';
import clsx from 'clsx';

const ToolbarBtnTooltip = ({ textKey, disabled, icon, className: extraClass, active, content, ...rest }) => {
  const { t } = useTranslation();

  const { isMobileDevice } = useContext(DeviceInfoContext);
  const dir                = useSelector(settingsGetUIDirSelector);
  const noFile             = !useSelector(textPageGetFileSelector);

  disabled = disabled ?? noFile;
  if (isMobileDevice) {
    return (
      <div
        {...rest}
        className={`text_toolbar_btn_with_text ${extraClass || ''}`}
        disabled={disabled}
      >
        {icon}
        <span className="title">
          {t(`page-with-text.buttons.mobile.${textKey}`)}
        </span>
      </div>
    );
  }

  return (
    <div className="relative inline-block group">
      <div
        {...rest}
        className={clsx('button', extraClass, { active, disabled })}
        disabled={disabled}
      >
        {icon}
        {content}
      </div>
      {!disabled && (
        <div
          className="absolute top-full left-1/2 -translate-x-1/2 mt-1 hidden group-hover:block rounded bg-gray-800 px-2 py-1 text-xs text-white whitespace-nowrap z-10 pointer-events-none"
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

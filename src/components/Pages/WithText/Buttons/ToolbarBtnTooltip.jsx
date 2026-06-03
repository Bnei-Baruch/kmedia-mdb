import { useContext, createContext } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

import { settingsGetUIDirSelector, textPageGetFileSelector } from '../../../../redux/selectors';
import { DeviceInfoContext } from '../../../../helpers/app-contexts';
import { clsx } from 'clsx';

export const ToolbarMenuContext = createContext(false);

const ToolbarBtnTooltip = ({ textKey, disabled, icon, className: extraClass, active, content, ...rest }) => {
  const { t } = useTranslation();

  const { isMobileDevice } = useContext(DeviceInfoContext);
  const inMenu             = useContext(ToolbarMenuContext);
  const dir                = useSelector(settingsGetUIDirSelector);
  const noFile             = !useSelector(textPageGetFileSelector);

  disabled = disabled ?? noFile;
  if (inMenu) {
    return (
      <div {...rest} className={clsx('text_toolbar__item_btn', extraClass)}>
        {icon}
        <span>{t(`page-with-text.buttons.mobile.${textKey}`)}</span>
      </div>
    );
  }

  if (isMobileDevice) {
    return (
      <div
        {...rest}
        className={clsx('flex flex-col items-center gap-1 text-gray-600', extraClass)}
        disabled={disabled}
      >
        {icon}
        <span className="block text-xs font-semibold leading-5">
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

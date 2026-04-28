import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { clsx } from 'clsx';

import { actions } from '../../../../redux/modules/textPage';
import { DeviceInfoContext } from '../../../../helpers/app-contexts';
import ToolbarBtnTooltip from '../../../Pages/WithText/Buttons/ToolbarBtnTooltip';
import { textPageGetTocIsActiveSelector } from '../../../../redux/selectors';

const TocToggleBtn = ({ withText = true, textKey = 'toc' }) => {
  const { t }    = useTranslation();
  const dispatch = useDispatch();

  const { isMobileDevice } = useContext(DeviceInfoContext);
  const tocIsActive        = useSelector(textPageGetTocIsActiveSelector);

  const handleTocIsActive = () => dispatch(actions.setTocIsActive());

  if (isMobileDevice) {
    const triggerProps = {
      className: 'clear_button',
      onClick  : handleTocIsActive,
      content  : withText ? '' : <span className="title">{t(`page-with-text.buttons.web.${textKey}`)}</span>,
    };

    const iconEl = <span className="material-symbols-outlined">view_list</span>;

    if (withText) {
      return (
        <ToolbarBtnTooltip textKey={textKey} {...triggerProps}>
          {iconEl}
          {triggerProps.content}
        </ToolbarBtnTooltip>
      );
    }

    return (
      <button
        {...triggerProps}
        className={clsx('clear_button border border-gray-300 rounded bg-white hover:bg-gray-50 p-1', { 'bg-gray-100': tocIsActive })}
      >
        {iconEl}
        {triggerProps.content}
      </button>
    );
  }

  return (
    <button
      className={clsx('toc_trigger clear_button border border-gray-300 rounded bg-white hover:bg-gray-50 p-1 inline-flex items-center gap-1', { 'flex_basis_150': !isMobileDevice })}
      onClick={handleTocIsActive}
    >
      <span className="material-symbols-outlined">view_list</span>
      <span>{t(`page-with-text.buttons.web.${textKey}`)}</span>
    </button>
  );
};

export default TocToggleBtn;

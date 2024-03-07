import React, { useContext } from 'react';
import { Button } from 'semantic-ui-react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import clsx from 'clsx';

import { actions } from '../../../../redux/modules/textPage';
import { DeviceInfoContext } from '../../../../helpers/app-contexts';
import ToolbarBtnTooltip from '../../../Pages/WithText/Buttons/ToolbarBtnTooltip';

const TocToggleBtn = ({ withText = true }) => {
  const { t }              = useTranslation();
  const dispatch           = useDispatch();
  const { isMobileDevice } = useContext(DeviceInfoContext);

  const handleTocIsActive = () => dispatch(actions.setTocIsActive());

  if (isMobileDevice) {
    const triggerProps = {
      className: 'clear_button',
      icon: <span className="material-symbols-outlined">view_list</span>,
      onClick: handleTocIsActive,
      content: withText ? '' : <span className="title">{t('page-with-text.buttons.web.toc')}</span>,
    };

    return (withText ? <ToolbarBtnTooltip textKey="toc" {...triggerProps} /> : <Button {...triggerProps} basic />);
  }

  return (
    <Button
      basic
      className={clsx('toc_trigger clear_button', { 'flex_basis_150': !isMobileDevice })}
      icon={<span className="material-symbols-outlined">view_list</span>}
      onClick={handleTocIsActive}
      content={<span>{t('page-with-text.buttons.web.toc')}</span>}
    />
  );
};

export default TocToggleBtn;

import React, { useContext } from 'react';
import { Button } from 'semantic-ui-react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { actions } from '../../../../redux/modules/textPage';
import { DeviceInfoContext } from '../../../../helpers/app-contexts';
import clsx from 'clsx';

const TocToggleBtn = () => {
  const { t }              = useTranslation();
  const dispatch           = useDispatch();
  const { isMobileDevice } = useContext(DeviceInfoContext);

  const handleTocIsActive = () => dispatch(actions.setTocIsActive());

  const content = isMobileDevice ? null : t('sources-library.toc');

  return (
    <Button
      className={clsx('toc_trigger clear_button', { 'flex_basis_150': !isMobileDevice })}
      icon="list layout"
      onClick={handleTocIsActive}
      content={content}
    />
  );
};

export default TocToggleBtn;

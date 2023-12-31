import React from 'react';
import { Button } from 'semantic-ui-react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { actions } from '../../../../redux/modules/textPage';

const TocTrigger = () => {
  const { t }             = useTranslation();
  const dispatch          = useDispatch();
  const handleTocIsActive = () => dispatch(actions.setTocIsActive());

  return (
    <Button
      className="toc_trigger clear_button flex_basis_150"
      icon="list layout"
      onClick={handleTocIsActive}
      content={t('sources-library.toc')}
    />
  );
};

export default TocTrigger;

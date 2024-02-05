import React from 'react';
import { Button } from 'semantic-ui-react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { textPageGetScrollDirSelector } from '../../../../redux/selectors';
import TooltipForWeb from '../../../shared/TooltipForWeb';

const ScrollToTopBtn = () => {
  const { t } = useTranslation();
  const mode  = useSelector(textPageGetScrollDirSelector);

  if (mode !== 2) return null;
  const handleScroll = () => window.scrollTo(0, 0);

  return (
    <TooltipForWeb
      text={t('page-with-text.buttons.scroll-top')}
      trigger={
        <Button
          icon={<span className="material-symbols-outlined">arrow_upward</span>}
          onClick={handleScroll}
          className="text__scroll-top"
          color="blue"
        />
      }
    />
  );
};

export default ScrollToTopBtn;

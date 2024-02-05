import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from 'semantic-ui-react';

import TooltipForWeb from '../../../shared/TooltipForWeb';

const MoreOptionsBtn = () => {
  const { t } = useTranslation();

  return (
    <TooltipForWeb
      text={t('page-with-text.buttons.more-options')}
      trigger={
        <Button
          circular
          icon={<span className="material-symbols-outlined">more_vert</span>}
        />
      }
    />
  );
};

export default MoreOptionsBtn;

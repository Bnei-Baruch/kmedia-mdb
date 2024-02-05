import { Button } from 'semantic-ui-react';
import React from 'react';
import { useTranslation } from 'react-i18next';

import TooltipForWeb from '../../../shared/TooltipForWeb';

const PrintBtn = () => {
  const { t } = useTranslation();

  const handlePrint = () => window.print();

  return (
    <TooltipForWeb
      text={t('page-with-text.buttons.print')}
      trigger={
        <Button
          icon={<span className="material-symbols-outlined">print</span>}
          onClick={handlePrint}
          className="computer-only"
        />
      }
    />
  );
};

export default PrintBtn;

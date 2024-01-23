import { Button, Popup } from 'semantic-ui-react';
import React from 'react';

const PrintBtn = () => {
  const handlePrint = () => window.print();
  return (
    <Popup
      on="hover"
      content={t('page-with-text.buttons.print')}
      trigger={
        (
          <Button
            icon={<span className="material-symbols-outlined">print</span>}
            onClick={handlePrint}
            className="computer-only"
          />
        )
      }
    />
  );
};

export default PrintBtn;

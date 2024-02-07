import { Button } from 'semantic-ui-react';
import React from 'react';

import ToolbarBtnTooltip from './ToolbarBtnTooltip';

const PrintBtn = () => {

  const handlePrint = () => window.print();

  return (
    <ToolbarBtnTooltip
      textKey="print"
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

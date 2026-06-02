import React from 'react';

import ToolbarBtnTooltip from './ToolbarBtnTooltip';

const PrintBtn = () => {

  const handlePrint = () => window.print();

  return (
    <ToolbarBtnTooltip
      textKey="print"
      icon={<span className="material-symbols-outlined">print</span>}
      onClick={handlePrint}
      className="hidden xl:block"
    />
  );
};

export default PrintBtn;

import { Button } from 'semantic-ui-react';
import React from 'react';

const PrintBtn = () => {
  const handlePrint = () => window.print();
  return (
    <Button
      icon={<span className="material-symbols-outlined">print</span>}
      onClick={handlePrint}
      className="computer-only"
    />
  );
};

export default PrintBtn;

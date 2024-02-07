import React from 'react';
import { Button } from 'semantic-ui-react';

import ToolbarBtnTooltip from './ToolbarBtnTooltip';

const MoreOptionsBtn = () => {
  return (
    <ToolbarBtnTooltip
      textKey="more-buttons"
      trigger={
        <Button
          icon={<span className="material-symbols-outlined">more_vert</span>}
        />
      }
    />
  );
};

export default MoreOptionsBtn;

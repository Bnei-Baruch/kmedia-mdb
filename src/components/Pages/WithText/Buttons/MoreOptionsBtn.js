import React from 'react';
import { Button } from 'semantic-ui-react';

import ToolbarBtnTooltip from './ToolbarBtnTooltip';

const MoreOptionsBtn = () => (
  <ToolbarBtnTooltip
    textKey="more-buttons"
    trigger={
      <Button
        circular
        icon={<span className="material-symbols-outlined">more_vert</span>}
      />
    }
  />
);

export default MoreOptionsBtn;

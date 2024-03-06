import React from 'react';

import ToolbarBtnTooltip from './ToolbarBtnTooltip';

const MoreOptionsBtn = () => (
  <ToolbarBtnTooltip
    textKey="more-buttons"
    circular
    icon={<span className="material-symbols-outlined">more_vert</span>}
  />
);

export default MoreOptionsBtn;

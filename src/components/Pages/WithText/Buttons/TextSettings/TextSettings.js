import React, { useState } from 'react';
import { Button, Menu, Popup } from 'semantic-ui-react';

import ZoomSizeBtns from './ZoomSizeBtns';
import FontTypeBtn from './FontTypeBtn';
import ThemeBtn from './ThemeBtn';
import ToolbarBtnTooltip from '../ToolbarBtnTooltip';

const TextSettings = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Popup
      trigger={
        <div>
          <ToolbarBtnTooltip
            textKey="text-settings"
            active={isOpen}
            icon={<span className="material-symbols-outlined">text_fields</span>}
          />
        </div>
      }
      on="click"
      position="bottom center"
      basic
      className="sources-settings"
      flowing
      hideOnScroll
      open={isOpen}
      onClose={() => setIsOpen(false)}
      onOpen={() => setIsOpen(true)}
      offset={[0, 10]}
    >
      <Popup.Content>
        <Menu fluid widths={2}>
          <ZoomSizeBtns />
        </Menu>
        <Menu fluid widths={2}>
          <FontTypeBtn />
        </Menu>
        <Menu fluid widths={3}>
          <ThemeBtn />
        </Menu>
      </Popup.Content>
    </Popup>
  );
};

export default TextSettings;

import React, { useState } from 'react';
import { Button, Menu, Popup } from 'semantic-ui-react';
import ZoomSizeBtns from './ZoomSizeBtns';
import FontTypeBtn from './FontTypeBtn';
import ThemeBtn from './ThemeBtn';

const TextSettings = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Popup
      trigger={
        <Button
          icon={<span className="material-symbols-outlined">text_fields</span>}
        />
      }
      on="click"
      position="bottom right"
      className="sources-settings"
      flowing
      hideOnScroll
      open={isOpen}
      onClose={() => setIsOpen(false)}
      onOpen={() => setIsOpen(true)}
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

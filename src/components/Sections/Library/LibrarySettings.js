import React, { useState, useEffect } from 'react';
import { Button, Icon, Menu, Popup } from 'semantic-ui-react';
import { useDispatch } from 'react-redux';
import { textFileSlice } from '../../../../lib/redux/slices/textFileSlice/textFileSlice';

const LibrarySettings = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dispatch            = useDispatch();

  //TODO david not sure that need it
  useEffect(() => {
    window.addEventListener('resize', () => setIsOpen(false));
    return () => {
      window.removeEventListener('resize', () => setIsOpen(false));
    };
  }, []);

  const handleFontSize = x => dispatch(textFileSlice.actions.setFontSize(x));
  const handleFontType = x => dispatch(textFileSlice.actions.setFontType(x));
  const handleTheme    = x => dispatch(textFileSlice.actions.setTheme(x));

  return (
    <Popup
      trigger={<Button compact size="small" icon="options" />}
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
          <Menu.Item onClick={() => handleFontSize(1)}>
            <Icon name="font" size="large" />
            <Icon name="plus" size="small" />
          </Menu.Item>
          <Menu.Item onClick={() => handleFontSize(-1)}>
            <Icon name="font" size="large" />
            <Icon name="minus" size="small" />
          </Menu.Item>
        </Menu>
        <Menu fluid widths={2}>
          <Menu.Item
            className="is-serif"
            name="Serif"
            onClick={() => handleFontType('serif')}
          />
          <Menu.Item name="Sans-serif" onClick={() => handleFontType('sans-serif')} />
        </Menu>
        <Menu fluid widths={3}>
          <Menu.Item
            name="Light"
            onClick={() => handleTheme('light')}
          />
          <Menu.Item name="Dark" onClick={() => handleTheme('dark')} />
          <Menu.Item name="Sepia" onClick={() => handleTheme('sepia')} />
        </Menu>
      </Popup.Content>
    </Popup>
  );
};

export default LibrarySettings;

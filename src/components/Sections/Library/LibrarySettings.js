import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Button, Icon, Menu, Popup } from 'semantic-ui-react';

const getItem = () => (JSON.parse(localStorage.getItem('library-settings')) || {});

const setItem = value => localStorage.setItem('library-settings', JSON.stringify(value));

const LibrarySettings = ({ handleSettings, fontSize }) => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    window.addEventListener('resize', () => setIsOpen(false));

    return () => {
      window.removeEventListener('resize', () => setIsOpen(false));
    }
  }, []);

  const handleNewSettings = newSettings => {
    const savedState         = getItem();
    const settings           = { ...savedState, ...newSettings };
    setItem(settings);
    handleSettings(settings);
  };

  const handleFontSize = amount => {
    if ((amount > 0 && fontSize >= 8) || (amount < 0 && fontSize <= -3)) {
      return;
    }

    handleNewSettings({ fontSize: fontSize + amount });
  };

  const savedState = getItem();
  handleSettings(savedState);

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
            onClick={() => handleNewSettings({ fontType: 'serif' })}
          />
          <Menu.Item name="Sans-serif" onClick={() => handleNewSettings({ fontType: 'sans-serif' })} />
        </Menu>
        <Menu fluid widths={3}>
          <Menu.Item
            name="Light"
            onClick={() => handleNewSettings({ theme: 'light' })}
          />
          <Menu.Item name="Dark" onClick={() => handleNewSettings({ theme: 'dark' })} />
          <Menu.Item name="Sepia" onClick={() => handleNewSettings({ theme: 'sepia' })} />
        </Menu>
      </Popup.Content>
    </Popup>
  );
}

LibrarySettings.propTypes = {
  handleSettings: PropTypes.func.isRequired,
  fontSize: PropTypes.number.isRequired,
};

export default LibrarySettings;

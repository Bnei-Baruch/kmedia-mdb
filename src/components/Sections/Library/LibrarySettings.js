import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Icon, Menu, Popup, } from 'semantic-ui-react';

class LibrarySettings extends Component {
  static propTypes = {
    handleSettings: PropTypes.func.isRequired,
    fontSize: PropTypes.number.isRequired,
  };

  static defaultProps = {};

  state = {
    isOpen: false,
  };

  componentDidMount() {
    const { handleSettings, } = this.props;
    const savedState          = LibrarySettings.getItem();
    handleSettings(savedState);
    window.addEventListener('resize', this.closePopup);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.closePopup);
  }

  static getItem = () => (JSON.parse(localStorage.getItem('library-settings')) || {});
  static setItem = value => localStorage.setItem('library-settings', JSON.stringify(value));

  closePopup = () => {
    this.handlePopup(false);
  };

  handlePopup = (isOpen) => {
    this.setState({ isOpen });
  };

  handleSettings = (newSettings) => {
    const { handleSettings, } = this.props;
    const savedState          = LibrarySettings.getItem();
    const settings            = { ...savedState, ...newSettings };
    LibrarySettings.setItem(settings);
    handleSettings(settings);
  };

  handleFontSize = (amount) => {
    const { fontSize, } = this.props;

    if ((amount > 0 && fontSize >= 8) || (amount < 0 && fontSize <= -3)) {
      return;
    }

    this.handleSettings({ fontSize: fontSize + amount });
  };

  render() {
    return (
      <Popup
        trigger={<Button compact size="small" icon="options" />}
        on="click"
        position="bottom right"
        className="sources-settings"
        flowing
        hideOnScroll
        open={this.state.isOpen}
        onClose={() => this.handlePopup(false)}
        onOpen={() => this.handlePopup(true)}
      >
        <Popup.Content>
          <Menu fluid widths={2}>
            <Menu.Item onClick={() => this.handleFontSize(1)}>
              <Icon name="font" size="large" />
              <Icon name="plus" size="small" />
            </Menu.Item>
            <Menu.Item onClick={() => this.handleFontSize(-1)}>
              <Icon name="font" size="large" />
              <Icon name="minus" size="small" />
            </Menu.Item>
          </Menu>
          <Menu fluid widths={2}>
            <Menu.Item
              className="is-serif"
              name="Serif"
              onClick={() => this.handleSettings({ fontType: 'serif' })}
            />
            <Menu.Item name="Sans-serif" onClick={() => this.handleSettings({ fontType: 'sans-serif' })} />
          </Menu>
          <Menu fluid widths={3}>
            <Menu.Item
              name="Light"
              onClick={() => this.handleSettings({ theme: 'light' })}
            />
            <Menu.Item name="Dark" onClick={() => this.handleSettings({ theme: 'dark' })} />
            <Menu.Item name="Sepia" onClick={() => this.handleSettings({ theme: 'sepia' })} />
          </Menu>
        </Popup.Content>
      </Popup>
    );
  }
}

export default LibrarySettings;

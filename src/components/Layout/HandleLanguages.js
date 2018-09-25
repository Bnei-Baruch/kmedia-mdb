import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Icon, Menu, Popup } from 'semantic-ui-react';

import UILanguage from './UILanguage';
import ContentLanguage from './ContentLanguage';
import * as shapes from '../shapes';

class HandleLanguages extends Component {
  static propTypes = {
    language: PropTypes.string.isRequired,
    contentLanguage: PropTypes.string.isRequired,
    setContentLanguage: PropTypes.func.isRequired,
    location: shapes.HistoryLocation.isRequired,
    t: PropTypes.func.isRequired,
  };

  state = {
    isActive: false,
  };

  handlePopupClose = () => this.setState({ isActive: false });

  handlePopupOpen = () => this.setState({ isActive: true });

  render() {
    const { t, language, location, contentLanguage, setContentLanguage } = this.props;
    const { isActive }                                                   = this.state;

    return (
      <Popup
        key="handleLangs"
        flowing
        // horizontalOffset={17}
        // basic
        position='bottom right'
        trigger={
          <Menu.Item onClick={this.handlePopupOpen}>
            <Icon name="sliders horizontal" />
            {t('languages.language')}
          </Menu.Item>
        }
        open={isActive}
        onOpen={this.handlePopupOpen}
        onClose={this.handlePopupClose}
        on="click"
      >
        <Popup.Content>
          <UILanguage language={language} t={t} location={location} contentLanguage={contentLanguage} />
          <ContentLanguage language={language} t={t} contentLanguage={contentLanguage} setContentLanguage={setContentLanguage} />
        </Popup.Content>
      </Popup>
    );
  }
}

export default HandleLanguages;

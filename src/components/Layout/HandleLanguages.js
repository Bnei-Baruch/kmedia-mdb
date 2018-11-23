import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Header, Icon, Menu, Popup } from 'semantic-ui-react';

import * as shapes from '../shapes';
import UILanguage from './UILanguage';
import ContentLanguage from './ContentLanguage';
import { getLanguageDirection } from '../../helpers/i18n-utils';

class HandleLanguages extends Component {
  static propTypes = {
    language: PropTypes.string.isRequired,
    contentLanguage: PropTypes.string.isRequired,
    setContentLanguage: PropTypes.func.isRequired,
    location: shapes.HistoryLocation.isRequired,
    t: PropTypes.func.isRequired,
    isMobileDevice: PropTypes.bool
  };

  state = {
    isActive: false,
  };

  handlePopupClose = () => this.setState({ isActive: false });

  handlePopupOpen = () => this.setState({ isActive: true });

  render() {
    const { t, language, location, contentLanguage, setContentLanguage, isMobileDevice } = this.props;
    const { isActive }                                                                   = this.state;
    const langDir                                                                        = getLanguageDirection(language);

    const popupStyle = {
      direction: langDir,
    };

    const trigger = isMobileDevice ? <Icon size="big" name="language" className="margin0" /> :
      <span><Icon name="sliders horizontal" />{t('languages.language')}</span>;
    return (
      <Popup
        key="handleLangs"
        flowing
        hideOnScroll
        position="bottom right"
        trigger={<Menu.Item onClick={this.handlePopupOpen} as="a">{trigger}</Menu.Item>}
        open={isActive}
        onOpen={this.handlePopupOpen}
        onClose={this.handlePopupClose}
        on="click"
        style={popupStyle}
      >
        <Popup.Header>
          <div className="handle-language-header title">
            <Header size="small" textAlign="center" content={t('languages.language')} />
            <Button
              basic
              compact
              size="tiny"
              content={t('buttons.close')}
              onClick={this.handlePopupClose}
            />
            {/*<Button*/}
            {/*primary*/}
            {/*compact*/}
            {/*size="tiny"*/}
            {/*content={t('buttons.apply')}*/}
            {/*onClick={this.apply}*/}
            {/*/>*/}
          </div>

        </Popup.Header>
        <Popup.Content>
          <UILanguage
            language={language}
            contentLanguage={contentLanguage}
            location={location}
            t={t}
          />
          <ContentLanguage
            language={language}
            contentLanguage={contentLanguage}
            setContentLanguage={setContentLanguage}
            t={t}
          />
        </Popup.Content>
      </Popup>
    );
  }
}

export default HandleLanguages;

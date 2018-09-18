import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Header, Icon, Menu, Popup, Segment } from 'semantic-ui-react';

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
        basic
        flowing
        trigger={
          <Menu.Item onClick={this.handlePopupOpen}>
            {t('languages.languages')}
            <Icon name="setting" />
          </Menu.Item>
        }
        open={isActive}
        onOpen={this.handlePopupOpen}
        on="click"
      >
        <Segment.Group>
          <Segment secondary>
            <div className="title">
              <Button basic compact icon="remove" onClick={this.handlePopupClose} />
              <Header size="small" textAlign="center" content={t('languages.title')} />
            </div>
            <div>{t('languages.explanation')}</div>
          </Segment>
          <Segment>
            <UILanguage language={language} t={t} location={location} contentLanguage={contentLanguage} />
          </Segment>
          <Segment>
            <ContentLanguage language={language} t={t} contentLanguage={contentLanguage} setContentLanguage={setContentLanguage} />
          </Segment>
        </Segment.Group>
      </Popup>
    );
  }
}

export default HandleLanguages;

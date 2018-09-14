import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Dropdown, Header, Popup, Segment } from 'semantic-ui-react';

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
          <Dropdown item labeled onClick={this.handlePopupOpen} text={'Languages'} icon="setting" options={[]} />
        }
        open={isActive}
        onOpen={this.handlePopupOpen}
        on="click"
      >
        <Popup.Header>
          <div className="title">
            <Button primary compact icon="remove" onClick={this.handlePopupClose} />
            <Header size="small" textAlign="center" content={t(`Interface & Content Languages`)} />
          </div>
          <div>Some explanation about UI and Preferable Content Languages behaviour</div>
        </Popup.Header>
        <Popup.Content>
          <Segment>
            <UILanguage language={language} t={t} location={location} contentLanguage={contentLanguage} />
          </Segment>
          <Segment>
            <ContentLanguage language={language} t={t} contentLanguage={contentLanguage} setContentLanguage={setContentLanguage} />
          </Segment>
        </Popup.Content>
      </Popup>
    );
  }
}

export default HandleLanguages;

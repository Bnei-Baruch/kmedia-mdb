import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withNamespaces } from 'react-i18next';
import { Button, Header, Icon, Popup } from 'semantic-ui-react';

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
    isMobile: PropTypes.bool,
    push: PropTypes.func.isRequired,
  };

  static defaultProps = {
    isMobile: false,
  };

  state = {
    isActive: false,
  };

  componentDidUpdate(prevProps) {
    if (prevProps.language !== this.props.language) {
      this.handlePopupClose();
    }
  }

  handlePopupOpen = () => this.setState({ isActive: true });

  handlePopupClose = () => this.setState({ isActive: false });

  render() {
    const { t, language, location, contentLanguage, setContentLanguage, isMobile, push } = this.props;
    const { isActive }                                                                   = this.state;
    const langDir                                                                        = getLanguageDirection(language);

    const popupStyle = {
      direction: langDir,
    };

    const Trigger = React.forwardRef((props, ref) => (
      <div onClick={this.handlePopupOpen} ref={ref}>
        {
          isMobile
            ? <Icon size="big" name="language" className="no-margin" />
            : (
              <>
                <Icon name="sliders horizontal" />
                {t('languages.language')}
              </>
            )
        }
      </div>
    ));

    return (
      <Popup
        id="handleLanguagesPopup"
        key="handleLangs"
        flowing
        position="bottom right"
        trigger={
          <Trigger />
        }
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
          </div>
        </Popup.Header>
        <Popup.Content>
          <UILanguage
            language={language}
            contentLanguage={contentLanguage}
            location={location}
            isMobile={isMobile}
            push={push}
          />
          <ContentLanguage
            language={language}
            contentLanguage={contentLanguage}
            location={location}
            setContentLanguage={setContentLanguage}
            isMobile={isMobile}
            push={push}
          />
        </Popup.Content>
      </Popup>
    );
  }
}

export default withNamespaces()(HandleLanguages);

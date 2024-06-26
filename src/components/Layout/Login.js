import React, { useContext, useState } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';

import { Button, Divider, List, Popup } from 'semantic-ui-react';
import { DeviceInfoContext } from '../../helpers/app-contexts';
import Link from '../Language/MultiLanguageLink';
import { login, logout, KC_API_WITH_REALM } from '../../pkg/ksAdapter/adapter';
import useIsLoggedIn from '../shared/useIsLoggedIn';
import { settingsGetUIDirSelector, settingsGetUILangSelector, authGetUserSelector } from '../../redux/selectors';

const Login = ({ t }) => {
  const [isActive, setIsActive] = useState(false);
  const { isMobileDevice }      = useContext(DeviceInfoContext);
  const uiLang                  = useSelector(settingsGetUILangSelector);
  const uiDir                   = useSelector(settingsGetUIDirSelector);
  const popupStyle              = { uiDir };
  const user                    = useSelector(authGetUserSelector);
  const nameLetter              = !!user && !!user.name ? user.name[0].toUpperCase() : '';
  const loggedIn                = useIsLoggedIn();

  const handlePopupOpen  = () => setIsActive(true);
  const handlePopupClose = () => setIsActive(false);

  const renderAccount = () => (
    <Popup
      id="handleLoginPopup"
      key="handleLogin"
      flowing
      position="bottom right"
      size="large"
      className="auth-popup"
      trigger={
        <Button
          circular
          compact
          className={'auth-button'}
          content={nameLetter}
          onClick={handlePopupClose}
        />
      }
      open={isActive}
      onOpen={handlePopupOpen}
      onClose={handlePopupClose}
      on="click"
      style={popupStyle}
      hideOnScroll
    >
      <Popup.Header content={user?.name}/>
      <Divider/>
      <Popup.Content>
        <List>
          <List.Item
            key="personal"
            as={Link}
            to={'/personal'}
            content={t('nav.sidebar.personal')}
          />
          <List.Item
            key="account"
            as="a"
            href={`${KC_API_WITH_REALM}/account/?kc_locale=${uiLang}`}
            content={t('personal.account')}
          />
          <List.Item
            key="logout"
            as="a"
            onClick={logout}
            content={t('personal.logout')}
          />
        </List>
      </Popup.Content>
    </Popup>
  );

  const renderLogin = () => (
    <Button
      compact
      basic
      icon={'user circle outline'}
      content={isMobileDevice ? null : t('personal.login')}
      className={isMobileDevice ? 'auth-button' : 'donate-button'}
      circular={isMobileDevice}
      color={'blue'}
      as="a"
      target="_blank"
      onClick={login}
    />
  );

  return loggedIn ? renderAccount() : renderLogin();
};

Login.propTypes = { t: PropTypes.func.isRequired };

export default withTranslation()(Login);

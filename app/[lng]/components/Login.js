import React, { useContext, useState } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { withTranslation } from 'next-i18next';

import { Button, Divider, List, Popup } from 'semantic-ui-react';
import { selectors } from '../../../lib/redux/slices/authSlice/authSlice';
import { selectors as settings } from '../../../lib/redux/slices/settingsSlice/settingsSlice';
import { DeviceInfoContext } from '../../../src/helpers/app-contexts';
import Link from '../../../src/components/Language/MultiLanguageLink';
import { login, logout } from '../../../pkg/ksAdapter/adapter';
import useIsLoggedIn from '../../../src/components/shared/useIsLoggedIn';

const Login = ({ t }) => {
  const [isActive, setIsActive] = useState(false);
  const { isMobileDevice }      = useContext(DeviceInfoContext);
  const uiLang                  = useSelector(state => settings.getUILang(state.settings));
  const uiDir                   = useSelector(state => settings.getUIDir(state.settings));
  const popupStyle              = { uiDir };
  const user                    = useSelector(state => selectors.getUser(state.auth));
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
          content={user?.name[0].toUpperCase()}
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
      <Popup.Header content={user?.name} />
      <Divider />
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
            href={`https://accounts.kab.info/auth/realms/main/account/?kc_locale=${uiLang}`}
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

Login.propTypes = { t: PropTypes.func.isRequired, };

export default withTranslation()(Login);

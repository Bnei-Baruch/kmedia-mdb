import React, { useContext, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { withNamespaces } from 'react-i18next';

import { Button, Divider, List, Popup } from 'semantic-ui-react';
import { selectors, actions } from '../../redux/modules/auth';
import { initKC } from '../../sagas/helpers/keycklockManager';
import { DeviceInfoContext } from '../../helpers/app-contexts';
import { getLanguageDirection } from '../../helpers/i18n-utils';
import Link from '../Language/MultiLanguageLink';

const Login = ({ t, language }) => {
  const [isActive, setIsActive] = useState(false);
  const { isMobileDevice }      = useContext(DeviceInfoContext);
  const direction               = getLanguageDirection(language);
  const popupStyle              = { direction };
  const dispatch                = useDispatch();
  const user                    = useSelector(state => selectors.getUser(state.auth));

  useEffect(() => {
    !user && initKC(dispatch, language);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = () => dispatch(actions.login(language));

  const logout = () => dispatch(actions.logout());

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
          content={user.name[0].toUpperCase()}
          onClick={handlePopupClose}
        />
      }
      open={isActive}
      onOpen={handlePopupOpen}
      onClose={handlePopupClose}
      on="click"
      style={popupStyle}
    >
      <Popup.Header content={user.name} />
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
            href={`https://accounts.kab.info/auth/realms/main/account/?kc_locale=${language}`}
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

  return user ? renderAccount() : renderLogin();
};

Login.propTypes =
  {
    t: PropTypes.func.isRequired,
  };

export default withNamespaces()(Login);

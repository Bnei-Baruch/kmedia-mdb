import React, { useContext, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { withNamespaces } from 'react-i18next';

import { Button, Header, Icon, Popup } from 'semantic-ui-react';
import { selectors, actions } from '../../redux/modules/auth';
import { selectors as settings } from '../../redux/modules/settings';
import { initKC } from '../../sagas/helpers/keycklockManager';
import { DeviceInfoContext } from '../../helpers/app-contexts';
import { getLanguageDirection } from '../../helpers/i18n-utils';

const Login = ({ t, language }) => {
  const [isActive, setIsActive] = useState(false);
  const { isMobileDevice }      = useContext(DeviceInfoContext);
  const direction               = getLanguageDirection(language);
  const popupStyle              = { direction };
  const dispatch                = useDispatch();
  const user                    = useSelector(state => selectors.getUser(state.auth));

  useEffect(() => {
    !user && initKC(dispatch, language);
  }, []);

  const login  = () => {
    dispatch(actions.login(language));

  };
  const logout = () => {
    dispatch(actions.logout());
  };

  const handlePopupOpen  = () => setIsActive(true);
  const handlePopupClose = () => setIsActive(false);

  const renderAccount = () => {
    return (
      <Popup
        id="handleLoginPopup"
        key="handleLogin"
        flowing
        position="bottom right"
        trigger={
          <Button
            circular
            compact
            size="tiny"
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
        <Popup.Header>
          <div className="handle-language-header title">
            <Header size="small" textAlign="center" content={user.name} />
            <Button
              basic
              compact
              size="tiny"
              content={t('buttons.close')}
              onClick={handlePopupClose}
            />
          </div>
        </Popup.Header>
        <Popup.Content>
          <Button
            fluid
            basic
            size="small"
            content={t('personal.logout')}
            className={'donate-button'}
            color={'blue'}
            onClick={logout}
          />
        </Popup.Content>
      </Popup>
    );
  };

  const renderLogin = () => (
    <Button
      compact
      basic
      icon={'user circle outline'}
      content={isMobileDevice ? null : t('personal.login')}
      className={'donate-button'}
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

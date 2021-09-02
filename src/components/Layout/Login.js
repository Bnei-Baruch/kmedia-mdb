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

const Login = ({ t }) => {
  const [isActive, setIsActive] = useState(false);
  const { isMobileDevice }      = useContext(DeviceInfoContext);
  const language                = useSelector(state => settings.getLanguage(state.settings));
  const direction               = getLanguageDirection(language);
  const popupStyle              = { direction };
  const dispatch                = useDispatch();
  const user                    = useSelector(state => selectors.getUser(state.auth));

  useEffect(() => {
    initKC(dispatch, language);
  }, []);

  const login  = () => {
    dispatch(actions.login(language));

  };
  const logout = () => {
    dispatch(actions.logout());
  };

  const handlePopupOpen  = () => setIsActive(true);
  const handlePopupClose = () => setIsActive(false);

  const Trigger = React.forwardRef((props, ref) => (
    <div onClick={handlePopupOpen} ref={ref}>
      {<Icon size="big" name="user circle" className={isMobileDevice ? 'no-margin' : ''} />}
    </div>
  ));

  const renderAccount = () => {
    return (
      <Popup
        id="handleLoginPopup"
        key="handleLogin"
        flowing
        position="bottom right"
        trigger={<Trigger />}
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
      size="small"
      icon={'user circle'}
      content={t('personal.login')}
      className={'donate-button'}
      color={'blue'}
      as="a"
      target="_blank"
      onClick={login}
    />
  );

  return user ? renderAccount() : renderLogin();
};

Login.propTypes = {
  t: PropTypes.func.isRequired,
};

export default React.memo(withNamespaces()(Login));

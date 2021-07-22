import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { withNamespaces } from 'react-i18next';

import { Button } from 'semantic-ui-react';
import { selectors, actions } from '../../redux/modules/auth';
import { selectors as settings } from '../../redux/modules/settings';
import { initKC } from '../../sagas/helpers/keycklockManager';

const Login = ({ t }) => {
  const dispatch = useDispatch();
  const user     = useSelector(state => selectors.getUser(state.auth));
  const language = useSelector(state => settings.getLanguage(state.settings));

  useEffect(() => {
    if (typeof window !== 'undefined') initKC(dispatch);
  }, []);

  useEffect(() => {
    console.log('keycloak user', user);
  }, [user]);

  const login  = () => {
    dispatch(actions.login(language));

  };
  const logout = () => {
    dispatch(actions.logout());
  };

  const renderAccount = () => {
    return (<Button
      compact
      basic
      size="small"
      icon={'user'}
      content={user.name}
      className={'vh-button'}
      as="a"
      target="_blank"
      onClick={logout}
    />);
  };

  const renderLogin = () => (
    <Button
      compact
      basic
      size="small"
      icon={'user'}
      content={t('home.login')}
      className={'vh-button'}
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

export default withNamespaces()(Login);

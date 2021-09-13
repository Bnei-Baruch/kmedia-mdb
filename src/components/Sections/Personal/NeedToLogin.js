import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { withNamespaces } from 'react-i18next';

import { actions, selectors } from '../../../redux/modules/auth';
import { Container, Divider, Button } from 'semantic-ui-react';

const ShowNeedToLogin = withNamespaces()(
  ({ t, language, children }) => {
    const dispatch = useDispatch();
    const login    = () => dispatch(actions.login(language));

    return (
      <Container className="padded" textAlign="center" fluid>
        <Divider hidden />
        {children}
        <h1>{t('personal.needToLogin')}</h1>
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
        <Divider hidden />
      </Container>
    );
  }
);

const NeedToLogin = () => {
  const user = useSelector(state => selectors.getUser(state.auth));
  return !user ? <ShowNeedToLogin /> : null;
};

export default NeedToLogin;

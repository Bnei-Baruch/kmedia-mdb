import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { withNamespaces } from 'react-i18next';

import { actions, selectors } from '../../../redux/modules/auth';
import { Container, Divider, Button, Header, Menu } from 'semantic-ui-react';

const ShowNeedToLogin = withNamespaces()(
  ({ t, language, children }) => {
    const dispatch = useDispatch();
    const login    = () => dispatch(actions.login(language));

    return (
      <div className="need_to_login">
        <div>
          <Header as="h1" content={t('nav.sidebar.personal')} className="weight-normal" />
          <Header as="h2" content={t('personal.needToLogin')} className="weight-normal" />
          <Divider hidden />
          <Button
            compact
            basic
            size="big"
            icon={'user circle outline'}
            content={t('personal.login')}
            color={'blue'}
            as="a"
            target="_blank"
            onClick={login}
          />
        </div>
      </div>
    );
  }
);

const NeedToLogin = () => {
  const user = useSelector(state => selectors.getUser(state.auth));
  return !user ? <ShowNeedToLogin /> : null;
};

export default NeedToLogin;

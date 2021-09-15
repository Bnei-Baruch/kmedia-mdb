import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { withNamespaces } from 'react-i18next';

import { actions, selectors } from '../../../redux/modules/auth';
import { Divider, Button, Header } from 'semantic-ui-react';
import { getLanguageDirection } from '../../../helpers/i18n-utils';
import { selectors as settings } from '../../../redux/modules/settings';

const ShowNeedToLogin = withNamespaces()(
  ({ t, children }) => {
    const dispatch = useDispatch();
    const language = useSelector(state => settings.getLanguage(state.settings));

    const dir = getLanguageDirection(language);

    const login = () => dispatch(actions.login(language));

    return (
      <div className="need_to_login">
        <div dir={dir}>
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

import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { withTranslation } from 'react-i18next';
import { Button, Divider, Header } from 'semantic-ui-react';

import { login } from '../../../pkg/ksAdapter/adapter';
import { settingsGetUIDirSelector, authGetUserSelector } from '../../../redux/selectors';

const ShowNeedToLogin = withTranslation()(
  ({ t }) => {
    const uiDir = useSelector(settingsGetUIDirSelector);

    return (
      <div className="need_to_login">
        <div dir={uiDir}>
          <Header as="h1" content={t('nav.sidebar.personal')} className="weight-normal"/>
          <Header as="h2" content={t('personal.needToLogin')} className="weight-normal"/>
          <Divider hidden/>
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
  const user = useSelector(authGetUserSelector);
  return useMemo(() => !user ? <ShowNeedToLogin/> : null, [user]);
};

export default NeedToLogin;

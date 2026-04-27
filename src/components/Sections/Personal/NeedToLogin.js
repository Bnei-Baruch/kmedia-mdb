import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { withTranslation } from 'react-i18next';

import { login } from '../../../pkg/ksAdapter/adapter';
import { settingsGetUIDirSelector, authGetUserSelector } from '../../../redux/selectors';

const ShowNeedToLogin = withTranslation()(
  ({ t }) => {
    const uiDir = useSelector(settingsGetUIDirSelector);

    return (
      <div className="need_to_login">
        <div dir={uiDir}>
          <h1 className="weight-normal">{t('nav.sidebar.personal')}</h1>
          <h2 className="weight-normal">{t('personal.needToLogin')}</h2>
          <hr className="invisible my-4"/>
          <a
            className="inline-flex items-center gap-2 rounded border border-blue-500 px-4 py-2 large text-blue-500"
            target="_blank"
            onClick={login}
            rel="noreferrer"
          >
            <span className="material-symbols-outlined">account_circle</span>
            {t('personal.login')}
          </a>
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

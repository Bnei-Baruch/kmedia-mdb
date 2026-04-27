import React, { useContext } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import { Popover, PopoverButton, PopoverPanel } from '@headlessui/react';

import { DeviceInfoContext } from '../../helpers/app-contexts';
import Link from '../Language/MultiLanguageLink';
import { login, logout, KC_API_WITH_REALM } from '../../pkg/ksAdapter/adapter';
import useIsLoggedIn from '../shared/useIsLoggedIn';
import { settingsGetUIDirSelector, settingsGetUILangSelector, authGetUserSelector } from '../../redux/selectors';

const Login = ({ t }) => {
  const { isMobileDevice } = useContext(DeviceInfoContext);
  const uiLang             = useSelector(settingsGetUILangSelector);
  const uiDir              = useSelector(settingsGetUIDirSelector);
  const user               = useSelector(authGetUserSelector);
  const nameLetter         = !!user && !!user.name ? user.name[0].toUpperCase() : '';
  const loggedIn           = useIsLoggedIn();

  const renderAccount = () => (
    <Popover className="relative">
      <PopoverButton as="div" className="auth-button">
        {nameLetter}
      </PopoverButton>
      <PopoverPanel
        anchor="bottom end"
        className="auth-popup z-50 mt-2 w-48 rounded-md bg-white shadow-lg ring-1 ring-black/5 p-3"
        style={{ direction: uiDir }}
      >
        <div className="font-semibold small mb-2">{user?.name}</div>
        <hr className="border-gray-200 mb-2" />
        <ul className="space-y-1.5 small">
          <li>
            <Link to="/personal" className="block hover:text-semantic-blue">
              {t('nav.sidebar.personal')}
            </Link>
          </li>
          <li>
            <a href={`${KC_API_WITH_REALM}/account/?kc_locale=${uiLang}`} className="block hover:text-semantic-blue">
              {t('personal.account')}
            </a>
          </li>
          <li>
            <a href="#" onClick={logout} className="block hover:text-semantic-blue">
              {t('personal.logout')}
            </a>
          </li>
        </ul>
      </PopoverPanel>
    </Popover>
  );

  const renderLogin = () => (
    <a
      href="#"
      onClick={login}
      className={`inline-flex items-center gap-1.5 border border-semantic-blue text-semantic-blue rounded hover:bg-semantic-blue hover:text-white transition-colors ${isMobileDevice ? 'auth-button w-8 h-8 justify-center rounded-full p-0' : 'donate-button px-3 py-1.5 small'}`}
    >
      <span className="material-symbols-outlined text-base">account_circle</span>
      {isMobileDevice ? null : t('personal.login')}
    </a>
  );

  return loggedIn ? renderAccount() : renderLogin();
};

Login.propTypes = { t: PropTypes.func.isRequired };

export default withTranslation()(Login);

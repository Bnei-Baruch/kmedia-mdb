import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import { getRSSFeedByLangs } from '../../helpers/utils';
import { useSelector } from 'react-redux';
import { settingsGetContentLanguagesSelector } from '../../redux/selectors';

const FeedBurner = ({ t }) => {
  const [email, setEmail] = useState('');
  const handleChange      = e => setEmail(e.target.value);
  const contentLanguages  = useSelector(settingsGetContentLanguagesSelector);

  const subscribe = () => {
    const uri = getRSSFeedByLangs(contentLanguages);
    window.open(
      `https://feedburner.google.com/fb/a/mailverify?uri=${uri}&email=${email}`,
      'popupwindow',
      'scrollbars=yes,width=550,height=520');
    setEmail('');
  };

  return (
    <form className="flex">
      <input
        type="email"
        name="email"
        onChange={handleChange}
        placeholder={t('nav.sidebar.subscribe')}
        value={email}
        className="flex-1 border border-gray-200 text-gray-700 rounded-l px-3 py-1.5 small outline-none focus:ring-1"
      />
      <button
        type="button"
        onClick={subscribe}
        disabled={!email}
        title={t('nav.sidebar.subscribe')}
        className="px-3 py-1.5 bg-gray-200 text-gray-700 rounded-r small disabled:opacity-50 hover:bg-blue-dark transition-colors"
      >
        <span className="material-symbols-outlined text-base">mail</span>
      </button>
    </form>
  );
};

FeedBurner.propTypes = {
  t: PropTypes.func.isRequired
};

export default withTranslation()(FeedBurner);

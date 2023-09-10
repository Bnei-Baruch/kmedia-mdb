import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { withTranslation } from 'next-i18next';
import { getRSSFeedByLangs } from '../../helpers/utils';
import { Form } from 'semantic-ui-react';
import { useSelector } from 'react-redux';
import { selectors as settings } from '../../../lib/redux/slices/settingsSlice/settingsSlice';

const FeedBurner = ({ t }) => {
  const [email, setEmail] = useState('');
  const handleChange      = (e, { value }) => setEmail(value);
  const contentLanguages         = useSelector(state => settings.getContentLanguages(state.settings));

  const subscribe = () => {
    const uri = getRSSFeedByLangs(contentLanguages);
    window.open(
      `https://feedburner.google.com/fb/a/mailverify?uri=${uri}&email=${email}`,
      'popupwindow',
      'scrollbars=yes,width=550,height=520');
    setEmail('');
  };

  return (
    <Form>
      <Form.Input
        action={{
          title: t('nav.sidebar.subscribe'),
          onClick: subscribe,
          icon: 'mail',
          compact: true,
          disabled: !email
        }}
        onChange={handleChange}
        name='email'
        className={'right action'}
        placeholder={t('nav.sidebar.subscribe')}
        value={email}
      />
    </Form>
  );
};

FeedBurner.propTypes = {
  t: PropTypes.func.isRequired,
};

export default withTranslation()(FeedBurner);

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { withNamespaces } from 'react-i18next';
import { getRSSFeedByLang } from '../../helpers/utils';
import { Form } from 'semantic-ui-react';

const FeedBurner = ({ language, t }) => {
  const [email, setEmail] = useState('');
  const handleChange      = (e, { name, value }) => setEmail({ [name]: value });

  const subscribe = () => {
    const uri = getRSSFeedByLang(language);
    window.open(
      `https://feedburner.google.com/fb/a/mailverify?uri=${uri}&email=${email}`,
      'popupwindow',
      'scrollbars=yes,width=550,height=520');
    this.setState({ email: '' });
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
  language: PropTypes.string.isRequired,
  t: PropTypes.func.isRequired,
};

export default withNamespaces()(FeedBurner);

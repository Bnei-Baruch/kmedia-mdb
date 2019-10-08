import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withNamespaces } from 'react-i18next';
import { getRSSFeedByLang } from "../../helpers/utils";
import { Form } from "semantic-ui-react";

class FeedBurner extends Component {
  static propTypes = {
    language: PropTypes.string.isRequired,
    t: PropTypes.func.isRequired,
  };

  state = {
    email: ''
  };

  subscribe = () => {
    const { email }    = this.state;
    const { language } = this.props;
    const uri          = getRSSFeedByLang(language);
    window.open(
      `https://feedburner.google.com/fb/a/mailverify?uri=${uri}&email=${email}`,
      'popupwindow',
      'scrollbars=yes,width=550,height=520');
    this.setState({ email: '' });
  };

  handleChange = (e, { name, value }) => this.setState({ [name]: value });

  render() {
    const { t } = this.props;
    const { email }    = this.state;
    return (
      <Form>
        <Form.Input
          action={{
            title: t('nav.sidebar.subscribe'),
            onClick: this.subscribe,
            icon: 'mail',
            compact: true,
            disabled: !email
          }}
          onChange={this.handleChange}
          name='email'
          className={'right action'}
          actionPosition="right"
          placeholder={t('nav.sidebar.subscribe')}
          value={email}
        />
      </Form>
    );
  }
}

export default withNamespaces()(FeedBurner);

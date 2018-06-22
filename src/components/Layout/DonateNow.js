import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Button } from 'semantic-ui-react';

import { selectors as settings } from '../../redux/modules/settings';
import { LANG_ENGLISH, LANG_RUSSIAN, LANG_UKRAINIAN } from '../../helpers/consts';

class DonateNow extends Component {
  static propTypes = {
    language: PropTypes.string.isRequired,
    t: PropTypes.func.isRequired,
  };

  render() {
    const { t, language } = this.props;

    let lang = language;
    switch (lang) {
    case LANG_UKRAINIAN:
      lang = LANG_RUSSIAN;
      break;
    case LANG_ENGLISH:
      lang = '';
      break;
    default:
      break;
    }

    return (
      <Button
        compact
        basic
        size="small"
        color="blue"
        icon="heart"
        content={t('home.donate')}
        className="donate-button"
        as="a"
        href={`http://kab1.com/${lang}`}
      />
    );
  }
}

export default connect(
  state => ({
    language: settings.getLanguage(state.settings),
  })
)(DonateNow);

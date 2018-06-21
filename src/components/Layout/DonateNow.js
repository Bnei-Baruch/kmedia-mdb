import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Button } from 'semantic-ui-react';

import { selectors as settings } from '../../redux/modules/settings';
import { LANG_RUSSIAN, LANG_UKRAINIAN } from '../../helpers/consts';

class DonateNow extends Component {
  static propTypes = {
    language: PropTypes.string.isRequired,
    t: PropTypes.func.isRequired,
  };

  render() {
    const { t, language } = this.props;

    return (
      <Button
        compact
        color="teal"
        icon="heart"
        content={t('home.donate')}
        as="a"
        href={`http://kab1.com/${(language === LANG_UKRAINIAN) ? LANG_RUSSIAN : language}`}
      />
    );
  }
}

export default connect(
  state => ({
    language: settings.getLanguage(state.settings),
  })
)(DonateNow);

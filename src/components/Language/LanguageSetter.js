import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { actions as settingActions, selectors as settingSelectors } from '../../redux/modules/settings';
import { DEFAULT_LANGUAGE, LANGUAGES } from '../../helpers/consts';
import * as shapes from '../shapes';

// NOTE: yaniv -> edo: should we block rendering until language changed?

const LanguageSetter = withRouter(connect(
  state => ({
    currentLanguage: settingSelectors.getLanguage(state.settings),
  }),
  { setLanguage: settingActions.setLanguage }
)(class extends React.Component {
  static propTypes = {
    currentLanguage: PropTypes.string.isRequired,
    language: PropTypes.string,
    setLanguage: PropTypes.func.isRequired,
    location: shapes.HistoryLocation.isRequired,
    children: shapes.Children.isRequired,
  };

  static defaultProps = {
    language: DEFAULT_LANGUAGE
  };

  componentDidMount() {
    this.catchLanguageChange(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.catchLanguageChange(nextProps);
  }

  catchLanguageChange = (props) => {
    // catch language change only on client
    if (typeof window === 'undefined') {
      return;
    }

    const { language: newLanguage, currentLanguage } = props;

    if (currentLanguage === newLanguage) {
      return;
    }

    let actualLanguage = DEFAULT_LANGUAGE;
    if (LANGUAGES[newLanguage]) {
      actualLanguage = newLanguage;
    }

    props.setLanguage(actualLanguage);
  };

  render() {
    return this.props.children;
  }
}));

export default LanguageSetter;

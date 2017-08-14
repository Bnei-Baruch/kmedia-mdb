import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { actions as settingActions, selectors as settingSelectors } from '../../redux/modules/settings';
import { LANGUAGES, DEFAULT_LANGUAGE } from '../../helpers/consts';

const LanguageSetter = connect(
  state => ({
    currentLanguage: settingSelectors.getLanguage(state.settings),
    location: state.router.location
  }),
  { setLanguage: settingActions.setLanguage }
)(class extends React.Component {

  static propTypes = {
    currentLanguage: PropTypes.string.isRequired,
    language: PropTypes.string,
    setLanguage: PropTypes.func.isRequired,
    location: PropTypes.object.isRequired
  };

  static defaultProps = {
    language: DEFAULT_LANGUAGE
  };

  componentWillReceiveProps(nextProps) {
    this.catchLanguageChange(nextProps);
  }

  // FIXME: (yaniv) block rendering until language changed
  componentDidMount() {
    this.catchLanguageChange(this.props);
  }

  catchLanguageChange = (props) => {
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
});

export default LanguageSetter;

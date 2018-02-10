import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { actions as settingActions, selectors as settingSelectors } from '../../redux/modules/settings';
import { LANGUAGES, DEFAULT_LANGUAGE } from '../../helpers/consts';
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
    location: PropTypes.object.isRequired,
    children: PropTypes.node.isRequired,
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

  catchLanguageChange = ({ language: newLanguage, currentLanguage, setLanguage }) => {
    if (currentLanguage === newLanguage) {
      return;
    }

    if (LANGUAGES[newLanguage]) {
      setLanguage(newLanguage);
    }
  };

  render() {
    return this.props.children;
  }
}));

export default LanguageSetter;

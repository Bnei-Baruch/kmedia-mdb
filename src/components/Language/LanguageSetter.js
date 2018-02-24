import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { actions as settingActions, selectors as settingSelectors } from '../../redux/modules/settings';
import { LANGUAGES, DEFAULT_LANGUAGE } from '../../helpers/consts';
import { changeDirectionIfNeeded } from '../../helpers/i18n-utils';


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
    location: PropTypes.object.isRequired
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
    const { language: newLanguage, currentLanguage } = props;

    // change page direction and fetch css
    // NOTE: yaniv -> edo (i18n object has a dir getter)
    // https://github.com/i18next/i18next/blob/master/src/i18next.js#L281
    changeDirectionIfNeeded(newLanguage);

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

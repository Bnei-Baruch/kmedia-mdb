import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { withNamespaces } from 'react-i18next';
import noop from 'lodash/noop';
import { Dropdown } from 'semantic-ui-react';

import { LANG_HEBREW, LANGUAGE_OPTIONS } from '../../helpers/consts';
import TimedPopup from '../shared/TimedPopup';

class AVLanguage extends PureComponent {
  static propTypes = {
    t: PropTypes.func.isRequired,
    onSelect: PropTypes.func,
    onDropdownOpenedChange: PropTypes.func.isRequired,
    selectedLanguage: PropTypes.string,
    requestedLanguage: PropTypes.string,
    languages: PropTypes.arrayOf(PropTypes.string),
    uiLanguage: PropTypes.string,
  };

  static defaultProps = {
    onSelect: noop,
    selectedLanguage: LANG_HEBREW,
    requestedLanguage: LANG_HEBREW,
    languages: [],
    uiLanguage: LANG_HEBREW,
  };

  state = {};

  static getDerivedStateFromProps(props, state){
    const { requestedLanguage, selectedLanguage } = props;
    
    if (requestedLanguage) {
      const { lastRequestedLanguage } = state;
      const openPopup = (lastRequestedLanguage === requestedLanguage) 
        ? false
        : (selectedLanguage !== requestedLanguage);

      return {
        lastRequestedLanguage: requestedLanguage,
        openPopup
      };
    }

    return null;
  }

  handleChange = (e, data) => this.props.onSelect(e, data.value);

  setLangSelectRef = langSelectRef => this.setState({ langSelectRef });

  handleOnOpen = () => this.props.onDropdownOpenedChange(true);

  handleOnClose = () => this.props.onDropdownOpenedChange(false);

  render() {
    const { t, languages, selectedLanguage, uiLanguage } = this.props;
    const { langSelectRef, openPopup }                   = this.state;

    const options = LANGUAGE_OPTIONS
      .filter(x => languages.includes(x.value))
      .map(x => ({ value: x.value, text: x.value }));

    return (
      <div ref={this.setLangSelectRef} className="mediaplayer__languages">
        <TimedPopup
          openOnInit={openPopup}
          message={t('messages.fallback-language')}
          downward={false}
          timeout={7000}
          language={uiLanguage}
          refElement={langSelectRef}
        />
        <Dropdown
          floating
          scrolling
          upward
          icon={null}
          selectOnBlur={false}
          options={options}
          value={selectedLanguage}
          onChange={this.handleChange}
          trigger={<button type="button">{selectedLanguage}</button>}
          onOpen={this.handleOnOpen}
          onClose={this.handleOnClose}
        />
      </div>
    );
  }
}

export default withNamespaces()(AVLanguage);
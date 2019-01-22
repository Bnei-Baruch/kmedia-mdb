import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withNamespaces } from 'react-i18next';
import uniq from 'lodash/uniq';
import { Container, Divider, Segment } from 'semantic-ui-react';
import isEqual from 'react-fast-compare';

import { RTL_LANGUAGES } from '../../../../../../helpers/consts';
import { selectSuitableLanguage } from '../../../../../../helpers/language';
import MediaHelper from '../../../../../../helpers/media';
import * as shapes from '../../../../../shapes';
import ButtonsLanguageSelector from '../../../../../Language/Selector/ButtonsLanguageSelector';
import WipErr from '../../../../../shared/WipErr/WipErr';

class Transcription extends Component {
  static propTypes = {
    unit: shapes.ContentUnit,
    doc2htmlById: PropTypes.objectOf(shapes.DataWipErr).isRequired,
    uiLanguage: PropTypes.string.isRequired,
    contentLanguage: PropTypes.string.isRequired,
    t: PropTypes.func.isRequired,
    onContentChange: PropTypes.func.isRequired,
  };

  static defaultProps = {
    unit: null,
  };

  constructor(props) {
    super(props);
    const state = Transcription.calcCurrentItem(this.props);
    this.state  = {
      selected: null,
      languages: [],
      language: null,
      ...state,
    };
  }

  componentDidMount() {
    const { selected, language } = this.state;
    if (selected && language) {
      const { doc2htmlById, onContentChange } = this.props;
      const { data }                          = doc2htmlById[selected.id] || {};
      if (!data) {
        onContentChange(selected.id);
      }
    }
  }

  shouldComponentUpdate(nextProps, _nextState) {
    const { props } = this;
    const toUpdate  = (nextProps.uiLanguage !== props.uiLanguage)
      || (nextProps.contentLanguage !== props.contentLanguage)
      || (nextProps.unit && !props.unit)
      || (nextProps.unit.id !== props.unit.id)
      || (nextProps.unit.files !== props.unit.files
      || !isEqual(nextProps.doc2htmlById, props.doc2htmlById));

    if (toUpdate) {
      const { selected, language } = this.setCurrentItem(nextProps);
      if (selected && language) {
        props.onContentChange(selected.id);
      }
    }

    return toUpdate;
  }

  static getTextFiles = (props) => {
    const { unit } = props;
    if (!unit || !Array.isArray(unit.files)) {
      return [];
    }

    return unit.files.filter(x => MediaHelper.IsText(x) && !MediaHelper.IsHtml(x));
  };

  static calcCurrentItem = (props) => {
    const { contentLanguage, uiLanguage } = props;

    const textFiles   = Transcription.getTextFiles(props);
    const languages   = uniq(textFiles.map(x => x.language));
    const newLanguage = selectSuitableLanguage(contentLanguage, uiLanguage, languages);
    if (!newLanguage) {
      return false;
    }

    const selected = Transcription.selectFile(textFiles, newLanguage);

    return { selected, languages, language: newLanguage, textFiles };
  };

  setCurrentItem = (props) => {
    const sUpdate = Transcription.calcCurrentItem(props);

    this.setState(sUpdate);

    return sUpdate;
  };

  static selectFile = (textFiles, language) => {
    const selected = textFiles.filter(x => x.language === language);

    if (selected.length <= 1) {
      // use the only file found OR no files by language - use first text file
      return selected[0];
    }

    // many files by language - get the largest - it is probably the transcription
    return selected.reduce((acc, file) => (acc.size < file.size ? file : acc));
  };

  handleLanguageChanged = (e, language) => {
    const { state, props } = this;
    if (language === state.language) {
      e.preventDefault();
      return;
    }

    const selected = Transcription.selectFile(state.textFiles, language);

    props.onContentChange(selected.id);
    this.setState({ selected, language });
  };

  render() {
    const { doc2htmlById, t }               = this.props;
    const { selected, languages, language } = this.state;

    if (!selected) {
      return <Segment basic>{t('materials.transcription.no-transcription')}</Segment>;
    }

    const { data, wip, err } = doc2htmlById[selected.id] || {};

    const wipErr = WipErr({ wip, err, t });
    if (wipErr) {
      return wipErr;
    }

    if (data) {
      const direction = RTL_LANGUAGES.includes(language) ? 'rtl' : 'ltr';

      const content = (
        <div
          className="doc2html"
          style={{ direction }}
          dangerouslySetInnerHTML={{ __html: data }}
        />
      );

      if (languages.length === 1) {
        return content;
      }

      return (
        <div>
          <Container fluid textAlign="center">
            <ButtonsLanguageSelector
              languages={languages}
              defaultValue={language}
              onSelect={this.handleLanguageChanged}
            />
          </Container>
          <Divider hidden />
          {content}
        </div>
      );
    }

    return null;
  }
}

export default withNamespaces()(Transcription);

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withNamespaces } from 'react-i18next';
import uniq from 'lodash/uniq';
import { Container, Divider, Segment } from 'semantic-ui-react';
import isEqual from 'react-fast-compare';

import { CT_ARTICLE, CT_RESEARCH_MATERIAL, MT_TEXT, RTL_LANGUAGES } from '../../../../../../helpers/consts';
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
    type: PropTypes.string,
    onContentChange: PropTypes.func.isRequired,
  };

  static defaultProps = {
    unit: null,
    type: null,
  };

  static selectFile = (textFiles, language) => {
    const selectedFiles = textFiles.filter(x => x.language === language);

    if (selectedFiles.length <= 1) {
      // use the only file found OR no files by language - use first text file
      return selectedFiles[0];
    }

    // many files by language - get the largest - it is probably the transcription
    return selectedFiles.reduce((acc, file) => (acc.size < file.size ? file : acc));
  };

  static getTextFiles = (unit, type) => {
    // const { unit, type } = props;
    if (!unit || !Array.isArray(unit.files)) {
      return [];
    }

    if (!type) {
      // filter text files, but not PDF
      return unit.files.filter(x => MediaHelper.IsText(x) && !MediaHelper.IsPDF(x));
    }

    return Transcription.getUnitDerivedArticle(unit, type);
  };

  static getUnitDerivedArticle(unit, type) {
    // suitable for having either derived articles or research materials only
    const ct = type === 'articles' ? CT_ARTICLE : CT_RESEARCH_MATERIAL;

    return Object.values(unit.derived_units || {})
      .filter(x => x.content_type === ct
        && (x.files || []).some(f => f.type === MT_TEXT))
      .map(x => x.files)
      .reduce((acc, files) => [...acc, ...files], []);
  }

  static getDerivedStateFromProps(props, state) {
    const { contentLanguage, uiLanguage, unit, type } = props;

    const textFiles   = Transcription.getTextFiles(unit, type);
    const languages   = uniq(textFiles.map(x => x.language));
    let newLanguage = selectSuitableLanguage(contentLanguage, uiLanguage, languages);
    if (!newLanguage) {
      return false;
    }
    if (state.language && state.language !== newLanguage) {
      newLanguage = state.language;
    }

    const selectedFile = Transcription.selectFile(textFiles, newLanguage);

    return { selectedFile, languages, language: newLanguage, textFiles };
  }

  state = {};

  componentDidMount() {
    const { selectedFile } = this.state;

    this.loadFile(selectedFile);
  }

  shouldComponentUpdate(nextProps, nextState) {
    const { props, state } = this;
    return (nextProps.uiLanguage !== props.uiLanguage)
      || (nextProps.contentLanguage !== props.contentLanguage)
      || (nextProps.unit && !props.unit)
      || (nextProps.unit.id !== props.unit.id) // eslint-disable-line react/prop-types
      || (nextProps.unit.files !== props.unit.files // eslint-disable-line react/prop-types
        || !isEqual(nextProps.doc2htmlById, props.doc2htmlById)
        || nextState.language !== state.language);
  }

  componentDidUpdate(prevState) {
    const { selectedFile, language } = this.state; // eslint-disable-line react/prop-types

    if (selectedFile !== prevState.selectedFile || language !== prevState.language) {
      this.loadFile(selectedFile);
    }
  }

  loadFile = (selectedFile) => {
    if (selectedFile && selectedFile.id) {
      const { doc2htmlById, onContentChange } = this.props;
      const { data }                          = doc2htmlById[selectedFile.id] || {};

      if (!data) {
        // load from redux
        onContentChange(selectedFile.id);
      }
    }
  };

  handleLanguageChanged = (e, newLanguage) => {
    const { language, textFiles } = this.state;

    if (newLanguage === language) {
      e.preventDefault();
      return;
    }

    const selectedFile = Transcription.selectFile(textFiles, newLanguage);

    this.setState({ selectedFile, language: newLanguage });
  };

  render() {
    const { doc2htmlById, t, type }             = this.props;
    const { selectedFile, languages, language } = this.state;

    if (!selectedFile) {
      const text = type || 'transcription';
      return <Segment basic>{t(`materials.${text}.no-content`)}</Segment>;
    }

    const { data, wip, err } = doc2htmlById[selectedFile.id] || {};

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

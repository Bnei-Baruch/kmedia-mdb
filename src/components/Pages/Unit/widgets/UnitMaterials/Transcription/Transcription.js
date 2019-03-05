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

  static calcCurrentState = (props) => {
    const { contentLanguage, uiLanguage } = props;

    const textFiles   = Transcription.getTextFiles(props);
    const languages   = uniq(textFiles.map(x => x.language));
    const newLanguage = selectSuitableLanguage(contentLanguage, uiLanguage, languages);
    if (!newLanguage) {
      return false;
    }

    const selectedFile = Transcription.selectFile(textFiles, newLanguage);

    return { selectedFile, languages, language: newLanguage, textFiles };
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

  static getTextFiles = (props) => {
    const { unit } = props;
    if (!unit || !Array.isArray(unit.files)) {
      return [];
    }

    // filter text files, but not PDF
    return unit.files.filter(x => MediaHelper.IsText(x) && !MediaHelper.IsPDF(x));
  };

  constructor(props) {
    super(props);
    this.state = Transcription.calcCurrentState(this.props);
  }

  componentDidMount() {
    const { selectedFile, language } = this.state;

    if (selectedFile && language) {
      const { doc2htmlById, onContentChange } = this.props;
      const { data }                          = doc2htmlById[selectedFile.id] || {};
      if (!data) {
        onContentChange(selectedFile.id);
      }
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    const { props, state } = this;
    const toUpdate  = (nextProps.uiLanguage !== props.uiLanguage)
      || (nextProps.contentLanguage !== props.contentLanguage)
      || (nextProps.unit && !props.unit)
      || (nextProps.unit.id !== props.unit.id)
      || (nextProps.unit.files !== props.unit.files
        || !isEqual(nextProps.doc2htmlById, props.doc2htmlById)
      || nextState.language !== state.language);

    return toUpdate;
  }

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
    const { doc2htmlById, t }               = this.props;
    const { selectedFile, languages, language } = this.state;

    if (!selectedFile) {
      return <Segment basic>{t('materials.transcription.no-transcription')}</Segment>;
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

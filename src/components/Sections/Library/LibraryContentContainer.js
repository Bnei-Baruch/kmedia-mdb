import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { assetUrl } from '../../../helpers/Api';
import { isEmpty } from '../../../helpers/utils';
import { selectSuitableLanguage } from '../../../helpers/language';
import { actions, selectors } from '../../../redux/modules/assets';
import * as shapes from '../../shapes';
import Library from './Library';
import PDF from '../../shared/PDF/PDF';

class LibraryContentContainer extends Component {
  static propTypes = {
    source: PropTypes.string,
    index: shapes.DataWipErr,
    content: shapes.DataWipErr.isRequired,
    t: PropTypes.func.isRequired,
    fetchAsset: PropTypes.func.isRequired,
    uiLanguage: PropTypes.string.isRequired,
    contentLanguage: PropTypes.string.isRequired,
    langSelectorMount: PropTypes.instanceOf(PropTypes.element),
  };

  static defaultProps = {
    source: null,
    index: {},
    langSelectorMount: null,
  };

  state = {
    languages: [],
    language: null,
  };

  componentDidMount() {
    this.setStateFromProps(this.props);
  }

  componentWillReceiveProps(nextProps) {
    let useStateLanguages = false;
    if (nextProps.index === this.props.index) {
      if (nextProps.uiLanguage !== this.props.uiLanguage || nextProps.contentLanguage !== this.props.contentLanguage) {
        // UI or Content language was changed
        useStateLanguages = true;
      } else {
        return false;
      }
    }
    return this.setStateFromProps(nextProps, useStateLanguages);
  }

  getFullUrl = (pdf, data, language) => {
    if (pdf) {
      return assetUrl(`sources/${pdf}`);
    }

    if (isEmpty(data) || isEmpty(data[language])) {
      return null;
    }

    return assetUrl(`sources/${this.props.source}/${data[language].docx}`);
  };

  getTaasPdf = () => {
    const { index, source, } = this.props;
    const { language }       = this.state;

    const isTaas     = PDF.isTaas(source);
    const startsFrom = PDF.startsFrom(source);
    let pdfFile;

    if (isTaas && index && index.data) {
      const data = index.data[language];
      if (data && data.pdf) {
        pdfFile = `${source}/${data.pdf}`;
      }
    }

    return { isTaas, startsFrom, pdfFile };
  };

  setStateFromProps = (nextProps, useStateLanguages = false) => {
    const { index: { data } = { index: { data: null } }, source, uiLanguage, contentLanguage } = nextProps;

    if (!data) {
      return { languages: [], language: null };
    }

    let { languages } = this.state;
    if (!useStateLanguages && data) {
      languages = Array.from(Object.keys(data));
    }
    const newLanguage = selectSuitableLanguage(contentLanguage, uiLanguage, languages);

    if (!newLanguage) {
      return false;
    }

    this.setState({ languages, language: newLanguage });

    if (!isEmpty(source)) {
      this.fetchContent(source, data[newLanguage]);
    }

    return true;
  };

  handleLanguageChanged = (e, language) => {
    const { index: { data }, source } = this.props;
    this.setState({ language });
    this.fetchContent(source, data[language]);
  };

  fetchContent = (source, data) => {
    // In case of TAS we prefer PDF, otherwise HTML
    if (data.pdf && PDF.isTaas(source)) {
      // pdf.js fetch it on his own (smarter than us), we fetch it for nothing.
      return;
    }

    this.props.fetchAsset(`sources/${source}/${data.html}`);
  };

  render() {
    const { content, index, t, langSelectorMount } = this.props;
    const { languages, language }                  = this.state;
    const { isTaas, startsFrom, pdfFile }          = this.getTaasPdf();

    return (
      <Library
        isTaas={isTaas}
        pdfFile={pdfFile}
        fullUrlPath={this.getFullUrl(pdfFile, index.data, language)}
        startsFrom={startsFrom}
        content={index && index.data ? content : {}}
        language={language}
        languages={languages}
        t={t}
        handleLanguageChanged={this.handleLanguageChanged}
        langSelectorMount={langSelectorMount}
      />
    );
  }
}

export default connect(
  state => ({
    content: selectors.getAsset(state.assets),
  }),
  dispatch => bindActionCreators({
    fetchAsset: actions.fetchAsset,
  }, dispatch)
)(LibraryContentContainer);

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { cmsUrl } from '../../../helpers/Api';
import { isEmpty } from '../../../helpers/utils';
import { selectSuitableLanguage } from '../../../helpers/language';
import { getQuery, updateQuery } from '../../../helpers/url';
import { actions, selectors } from '../../../redux/modules/assets';
import * as shapes from '../../shapes';
import Library from './Library';
import PDF from '../../shared/PDF/PDF';

const fetchContent = (source, data, language, fetchSource) => {
  // In case of TAS we prefer PDF, otherwise HTML
  if (data.pdf && PDF.isTaas(source)) {
    // pdf.js fetch it on his own (smarter than us), we fetch it for nothing.
    return;
  }

  let id = source;
  if (/^gr-/.test(id)) { // Rabash Group Articles
    const result = /^gr-(.+)/.exec(id);
    id           = result[1];
  }
  fetchSource({ sourceID: id, name: data.html, language });
};

const getFullUrl = (pdf, data, language, source) => {
  let id = source;
  if (/^gr-/.test(id)) { // Rabash Group Articles
    const result = /^gr-(.+)/.exec(id);
    id           = result[1];
  }

  if (pdf) {
    pdf = pdf.replace(`${id}/`, '');
    return `${cmsUrl('sources')}/${pdf}?uid=${id}&language=${language}`;
  }

  if (isEmpty(data) || isEmpty(data[language])) {
    return null;
  }

  return `${cmsUrl('sources')}/${data[language].html}?uid=${id}&language=${language}`;
};

class LibraryContentContainer extends Component {
  static propTypes = {
    source: PropTypes.string,
    index: shapes.DataWipErr,
    content: shapes.DataWipErr.isRequired,
    fetchSource: PropTypes.func.isRequired,
    uiLanguage: PropTypes.string.isRequired,
    contentLanguage: PropTypes.string.isRequired,
    langSelectorMount: PropTypes.instanceOf(PropTypes.element),
    history: shapes.History.isRequired,
    downloadAllowed: PropTypes.bool.isRequired,
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
    const { index, uiLanguage, contentLanguage } = this.props;
    let useStateLanguages                        = false;
    if (nextProps.index === index) {
      if (nextProps.uiLanguage !== uiLanguage || nextProps.contentLanguage !== contentLanguage) {
        // UI or Content language was changed
        useStateLanguages = true;
      } else {
        return false;
      }
    }
    return this.setStateFromProps(nextProps, useStateLanguages);
  }

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
    const { index: { data } = { index: { data: null } }, source, uiLanguage, contentLanguage, history } = nextProps;

    if (!data) {
      return { languages: [], language: null };
    }

    let { languages } = this.state;
    if (!useStateLanguages && data) {
      languages = [...Object.keys(data)];
    }
    const query            = getQuery(history.location);
    const queryLanguage    = languages.includes(query.language) ? query.language : undefined;
    const priorityLanguage = queryLanguage || contentLanguage;
    const newLanguage      = selectSuitableLanguage(priorityLanguage, uiLanguage, languages);

    if (!newLanguage) {
      return false;
    }

    this.setState({ languages, language: newLanguage });

    if (!isEmpty(source)) {
      const { fetchSource } = this.props;
      fetchContent(source, data[newLanguage], newLanguage, fetchSource);
    }

    return true;
  };

  handleLanguageChanged = (e, language) => {
    const { index: { data }, source, fetchSource, history } = this.props;
    updateQuery(history, query => ({
      ...query,
      language,
    }));
    this.setState({ language });
    fetchContent(source, data[language], language, fetchSource);
  };

  render() {
    const { content, index, langSelectorMount, source, downloadAllowed } = this.props;
    const { languages, language }                                        = this.state;
    const { isTaas, startsFrom, pdfFile }                                = this.getTaasPdf();

    return (
      <Library
        isTaas={isTaas}
        pdfFile={pdfFile}
        fullUrlPath={getFullUrl(pdfFile, index.data, language, source)}
        sourceId={source}
        startsFrom={startsFrom}
        content={index && index.data ? content : {}}
        language={language}
        languages={languages}
        handleLanguageChanged={this.handleLanguageChanged}
        langSelectorMount={langSelectorMount}
        downloadAllowed={downloadAllowed}
      />
    );
  }
}

export default connect(
  state => ({
    content: selectors.getSource(state.assets),
  }),
  dispatch => bindActionCreators({
    fetchSource: actions.fetchSource,
  }, dispatch)
)(LibraryContentContainer);

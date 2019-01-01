import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withNamespaces } from 'react-i18next';
import { withRouter } from 'react-router-dom';
import { Container, Portal, Segment } from 'semantic-ui-react';
import isEqual from 'react-fast-compare';

import { assetUrl } from '../../../helpers/Api';
import { RTL_LANGUAGES, } from '../../../helpers/consts';
import { formatError, isEmpty } from '../../../helpers/utils';
import * as shapes from '../../shapes';
import { ErrorSplash, FrownSplash, LoadingSplash } from '../../shared/Splash/Splash';
import AnchorsLanguageSelector from '../../Language/Selector/AnchorsLanguageSelector';
import PDF from '../../shared/PDF/PDF';
import { updateQuery } from '../../../helpers/url';
import withPagination from '../../Pagination/withPagination';
import Download from '../../shared/Download/Download';

class Library extends Component {
  static propTypes = {
    content: PropTypes.shape({
      data: PropTypes.string, // actual content (HTML)
      wip: shapes.WIP,
      err: shapes.Error,
    }),
    isTaas: PropTypes.bool.isRequired,
    pdfFile: PropTypes.string,
    startsFrom: PropTypes.number,
    language: PropTypes.string,
    languages: PropTypes.arrayOf(PropTypes.string),
    langSelectorMount: PropTypes.instanceOf(PropTypes.element),
    t: PropTypes.func.isRequired,
    handleLanguageChanged: PropTypes.func.isRequired,
    history: shapes.History.isRequired,
    fullUrlPath: PropTypes.string,
  };

  static defaultProps = {
    language: null,
    languages: [],
    langSelectorMount: null,
    content: {
      data: null,
      wip: false,
      err: null,
    },
    pdfFile: null,
    startsFrom: 1,
    fullUrlPath: null,
  };

  constructor(props) {
    super(props);

    const { history: { location } } = props;
    const pageNumber                = withPagination.getPageFromLocation(location);

    this.state = { pageNumber };
  }

  shouldComponentUpdate(nextProps, nextState) {
    const { props, state } = this;
    return !isEqual(props, nextProps) || !isEqual(state, nextState);
  }

  pageNumberHandler = (pageNumber) => {
    const { history } = this.props;
    this.setState({ pageNumber });
    updateQuery(history, query => ({
      ...query,
      page: pageNumber,
    }));
  };

  render() {
    const { content, language, languages, t, isTaas, langSelectorMount, fullUrlPath } = this.props;

    if (isEmpty(content)) {
      return <Segment basic>&nbsp;</Segment>;
    }

    const direction = RTL_LANGUAGES.includes(language) ? 'rtl' : 'ltr';

    // PDF.js will fetch file by itself
    const { pdfFile, startsFrom } = this.props;
    const usePdfFile              = isTaas && pdfFile;
    const mimeType                = usePdfFile ? 'application/pdf' : 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
    const { pageNumber }          = this.state;
    let contentsToDisplay;

    const { wip: contentWip, err: contentErr, data: contentData } = content;

    if (contentErr) {
      if (contentErr.response && contentErr.response.status === 404) {
        contentsToDisplay = <FrownSplash text={t('messages.source-content-not-found')} />;
      } else {
        contentsToDisplay = <ErrorSplash text={t('messages.server-error')} subtext={formatError(contentErr)} />;
      }
    } else if (contentWip) {
      contentsToDisplay = <LoadingSplash text={t('messages.loading')} subtext={t('messages.loading-subtext')} />;
    } else if (usePdfFile) {
      contentsToDisplay = (
        <PDF
          pdfFile={assetUrl(`sources/${pdfFile}`)}
          pageNumber={pageNumber || 1}
          startsFrom={startsFrom}
          pageNumberHandler={this.pageNumberHandler}
        />);
    } else if (contentData) {
      contentsToDisplay = (
        <div
          style={{ direction, textAlign: (direction === 'ltr' ? 'left' : 'right') }}
          dangerouslySetInnerHTML={{ __html: contentData }}
        />);
    } else {
      return <Segment basic>{t('sources-library.no-source')}</Segment>;
    }

    let languageBar = null;
    if (languages.length > 0) {
      const { handleLanguageChanged } = this.props;
      languageBar                     = (
        <Container fluid textAlign="right">
          <AnchorsLanguageSelector
            languages={languages}
            defaultValue={language}
            onSelect={handleLanguageChanged}
          />
        </Container>
      );
    }

    return (
      <div>
        {
          langSelectorMount && languageBar
            ? <Portal open preprend mountNode={langSelectorMount}>{languageBar}</Portal>
            : languageBar
        }
        <Download path={fullUrlPath} mimeType={mimeType} />
        {contentsToDisplay}
      </div>
    );
  }
}

export default withRouter(withNamespaces()(Library));

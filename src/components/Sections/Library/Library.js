import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { Container, Portal, Segment } from 'semantic-ui-react';
import { assetUrl } from '../../../helpers/Api';

import { RTL_LANGUAGES, } from '../../../helpers/consts';
import { formatError, isEmpty, shallowCompare } from '../../../helpers/utils';
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

  state = {};

  componentWillMount() {
    const { history: { location } } = this.props;
    const pageNumber                = withPagination.getPageFromLocation(location);

    this.setState({ pageNumber });
  }

  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState);
  }

  pageNumberHandler = (pageNumber) => {
    this.setState({ pageNumber });
    updateQuery(this.props.history, query => ({
      ...query,
      page: pageNumber,
    }));
  };

  render() {
    const { content, language, languages, t, isTaas, langSelectorMount, fullUrlPath } = this.props;

    const direction = RTL_LANGUAGES.includes(language) ? 'rtl' : 'ltr';

    // PDF.js will fetch file by itself
    const usePdfFile = isTaas && this.props.pdfFile;
    const mimeType = usePdfFile ? 'application/pdf' : 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
    let contents;

    if (usePdfFile) {
      contents = (<PDF
        pdfFile={assetUrl(`sources/${this.props.pdfFile}`)}
        pageNumber={this.state.pageNumber || 1}
        startsFrom={this.props.startsFrom}
        pageNumberHandler={this.pageNumberHandler}
      />);
    } else if (isEmpty(content)) {
      return <Segment basic>&nbsp;</Segment>;
    }

    const { wip: contentWip, err: contentErr, data: contentData } = content;

    if (contentErr) {
      if (contentErr.response && contentErr.response.status === 404) {
        contents = <FrownSplash text={t('messages.source-content-not-found')} />;
      } else {
        contents = <ErrorSplash text={t('messages.server-error')} subtext={formatError(contentErr)} />;
      }
    } else if (contentWip) {
      contents = <LoadingSplash text={t('messages.loading')} subtext={t('messages.loading-subtext')} />;
    } else if (!contentData && !usePdfFile) {
      return <Segment basic>{t('sources-library.no-source')}</Segment>;
    } else if (!usePdfFile) {
      contents        = (<div
        style={{ direction, textAlign: (direction === 'ltr' ? 'left' : 'right') }}
        dangerouslySetInnerHTML={{ __html: contentData }}
      />);
    }

    let languageBar = null;
    if (languages.length > 0) {
      languageBar = (
        <Container fluid textAlign="right">
          <AnchorsLanguageSelector
            languages={languages}
            defaultValue={language}
            t={t}
            onSelect={this.props.handleLanguageChanged}
          />
        </Container>
      );
    }

    return (
      <div>
        {
          langSelectorMount && languageBar ?
            <Portal open preprend mountNode={langSelectorMount}>
              {languageBar}
            </Portal>
            :
            languageBar
        }
        <Download path={fullUrlPath} mimeType={mimeType} />
        {contents}
      </div>
    );
  }
}

export default withRouter(Library);

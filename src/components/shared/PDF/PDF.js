import React, { Component } from 'react';
import PropTypes from 'prop-types';
import throttle from 'lodash/throttle';
import noop from 'lodash/noop';
import { withNamespaces } from 'react-i18next';
import { Container, } from 'semantic-ui-react';
import { Document, Page } from 'react-pdf';
import { pdfjs } from 'react-pdf';

import { BS_TAAS_PARTS } from '../../../helpers/consts';
import PDFMenu from './PDFMenu';
import { ErrorSplash, LoadingSplash } from '../Splash/Splash';

export const isTaas     = source => (BS_TAAS_PARTS[source] !== undefined);
export const startsFrom = source => BS_TAAS_PARTS[source];

class PDF extends Component {
  static propTypes = {
    pdfFile: PropTypes.string.isRequired,
    startsFrom: PropTypes.number.isRequired,
    pageNumber: PropTypes.number.isRequired,
    pageNumberHandler: PropTypes.func,
    t: PropTypes.func.isRequired,
  };

  static defaultProps = {
    pageNumberHandler: noop,
  };

  constructor(props) {
    super(props);

    this.state = {
      pageNumber: props.pageNumber,
      numPages: null,
      width: null,
    };
  }

  componentDidMount() {
    this.setDivSize();
    window.addEventListener('resize', this.throttledSetDivSize);
    const { pdfFile } = this.props;
    this.setState({ pdfFile });
  }

  static getDerivedStateFromProps(nextProps, state) {
    const { pdfFile } = state;
    if (pdfFile !== nextProps.pdfFile) {
      return {
        pdfFile: nextProps.pdfFile,
        pageNumber: nextProps.pageNumber,
        numPages: null,
      };
    }
    return null;
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.throttledSetDivSize);
  }

  onDocumentLoadSuccess = ({ numPages }) => {
    const { pageNumber }                    = this.state;
    const { startsFrom, pageNumberHandler } = this.props;

    let pageNo;
    if (pageNumber >= startsFrom && pageNumber <= (startsFrom + numPages + -1)) {
      pageNo = pageNumber;
    } else {
      pageNo = startsFrom;
    }
    this.setState({ numPages, pageNumber: pageNo });
    pageNumberHandler(pageNo);
  };

  setDivSize = () => this.setState({
    width: document.getElementById('pdfWrapper').getBoundingClientRect().width
  });

  setPage = (pageNo) => {
    const { pageNumberHandler } = this.props;

    this.setState({ pageNumber: pageNo });
    pageNumberHandler(pageNo);
  };

  throttledSetDivSize = () => throttle(this.setDivSize, 500);

  render() {
    const { numPages, pageNumber, width } = this.state;
    const { pdfFile, startsFrom, t }      = this.props;
    pdfjs.GlobalWorkerOptions.workerSrc   = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

    return (
      <div id="pdfWrapper" style={{ marginTop: '10px' }}>
        <Container fluid textAlign="center">
          <PDFMenu
            numPages={numPages}
            pageNumber={pageNumber}
            startsFrom={startsFrom}
            setPage={this.setPage}
          />
        </Container>
        <div style={{ direction: 'ltr' }}>
          <Document
            file={pdfFile}
            onLoadSuccess={this.onDocumentLoadSuccess}
            error={<ErrorSplash text={t('messages.server-error')} subtext={t('messages.failed-to-load-pdf-file')} />}
            loading={<LoadingSplash text={t('messages.loading')} subtext={t('messages.loading-subtext')} />}
          >
            {
              numPages &&
              (
                <Page
                  width={width}
                  pageNumber={pageNumber + (-startsFrom) + 1}
                  renderAnnotations={false}
                  renderTextLayer={false}
                  renderMode="svg"
                />
              )
            }
          </Document>

        </div>
        <Container fluid textAlign="center">
          <PDFMenu
            numPages={numPages}
            pageNumber={pageNumber}
            startsFrom={startsFrom}
            setPage={this.setPage}
          />
        </Container>
      </div>
    );
  }
}

export default withNamespaces()(PDF);

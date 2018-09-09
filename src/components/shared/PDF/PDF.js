import React, { Component } from 'react';
import PropTypes from 'prop-types';
import throttle from 'lodash/throttle';
import noop from 'lodash/noop';
import { translate } from 'react-i18next';
import { Document, Page } from 'react-pdf/dist/entry.webpack';
import { Container, } from 'semantic-ui-react';

import { BS_TAAS_PARTS } from '../../../helpers/consts';
import { ErrorSplash, LoadingSplash, } from '../../shared/Splash/Splash';
import PDFMenu from './PDFMenu';

class PDF extends Component {
  static isTaas = source => (BS_TAAS_PARTS[source] !== undefined);
  static startsFrom = source => BS_TAAS_PARTS[source];

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
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.pdfFile !== nextProps.pdfFile) {
      const pageNumber = nextProps.pageNumber + nextProps.startsFrom + -1;
      this.setState({
        pageNumber,
        numPages: null,
      });
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.throttledSetDivSize);
  }

  onDocumentLoadSuccess = ({ numPages }) => {
    const { pageNumber } = this.state;
    const { startsFrom } = this.props;

    let pageNo;
    if (pageNumber >= startsFrom && pageNumber <= (startsFrom + numPages + -1)) {
      pageNo = pageNumber;
    } else {
      pageNo = startsFrom;
    }
    this.setState({ numPages, pageNumber: pageNo });
    this.props.pageNumberHandler(pageNo);
  };

  setDivSize = () =>
    this.setState({
      width: document.getElementById('pdfWrapper').getBoundingClientRect().width
    });

  setPage = (pageNo) => {
    this.setState({ pageNumber: pageNo });
    this.props.pageNumberHandler(pageNo);
  };

  throttledSetDivSize = () => throttle(this.setDivSize, 500);

  render() {
    const { numPages, pageNumber, width, } = this.state;
    const { startsFrom, pdfFile, t, }      = this.props;

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
              numPages ?
                <Page
                  width={width}
                  pageNumber={pageNumber + (-startsFrom) + 1}
                  renderAnnotations={false}
                  renderTextLayer={false}
                  renderMode="svg"
                /> : null
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

export default translate()(PDF);

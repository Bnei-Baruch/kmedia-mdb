import React, { Component } from 'react';
import PropTypes from 'prop-types';
import throttle from 'lodash/throttle';
import noop from 'lodash/noop';
import { withNamespaces } from 'react-i18next';
import { Container, } from 'semantic-ui-react';

import { BS_TAAS_PARTS } from '../../../helpers/consts';
import PDFMenu from './PDFMenu';
import LoadedPDF from './LoadedPDF';

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
    const { pdfFile } = this.props;
    this.setState({ pdfFile });
  }

  static getDerivedStateFromProps(nextProps, state) {
    const { pdfFile } = state;
    if (pdfFile !== nextProps.pdfFile) {
      return {
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
    const { numPages, pageNumber } = this.state;
    const { startsFrom, }          = this.props;

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
          <LoadedPDF {...this.props} {...this.state} onDocumentLoadSuccess={this.onDocumentLoadSuccess} />
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

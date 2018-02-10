import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Document, Page } from 'react-pdf/build/entry.webpack';
import throttle from 'lodash.throttle';

import PDFMenu from './PDFMenu';
import { BS_TAAS_PARTS } from '../../../helpers/consts';

class PDF extends Component {
  static propTypes = {
    pdfFile: PropTypes.string.isRequired,
    startsFrom: PropTypes.number.isRequired,
    pageNumber: PropTypes.number.isRequired,
  };

  static defaultProps = {};

  static isTaas = source => (BS_TAAS_PARTS.findIndex(a => a.id === source) !== -1);

  static startsFrom = (source) => {
    const taas = BS_TAAS_PARTS.find(a => a.id === source);
    return (taas ? taas.startsFrom : null);
  };

  state = {
    numPages: null,
    inputError: false,
    pageNumber: this.props.pageNumber + this.props.startsFrom + -1,
    width: null,
    inputValue: 0
  };

  componentWillMount() {
    window.removeEventListener('resize', this.throttledSetDivSize);
  }

  componentDidMount() {
    this.setDivSize();
    window.addEventListener('resize', this.throttledSetDivSize);
  }

  onDocumentLoadSuccess = ({ numPages }) => {
    const page = this.props.pageNumber + this.props.startsFrom + -1;
    this.setState({ numPages, pageNumber: page, inputValue: page });
  };

  setDivSize = () => this.setState({ width: document.getElementById('pdfWrapper').getBoundingClientRect().width });

  setPage = pageNo => this.setState({ pageNumber: pageNo }, () => {
    this.setState({ inputValue: pageNo });
  });

  throttledSetDivSize = () => throttle(this.setDivSize, 500);

  restoreError = () => setTimeout(() => this.setState({ inputError: false }), 1000);

  validateValue(value) {
    if (value === '') {
      this.setState({ inputError: true }, this.restoreError);
      return false;
    }

    if (Number.isNaN(value)) {
      this.setState({ inputError: true }, this.restoreError);
      return false;
    }
    const realValue = value + -this.props.startsFrom + 1;
    if (realValue < 1 || realValue > this.state.numPages) {
      this.setState({ inputError: true }, this.restoreError);
      return false;
    }

    this.setState({ inputError: false });
    return true;
  }

  handleChange = (e, { value }) => {
    this.setState({ inputValue: value });
  };

  render() {
    const { numPages, pageNumber, width, } = this.state;
    const { startsFrom, }                  = this.props;

    return (
      <div id="pdfWrapper">
        <PDFMenu
          numPages={numPages}
          pageNumber={pageNumber}
          startsFrom={startsFrom}
          inputValue={this.state.inputValue}
          inputError={this.state.inputError}
          handleChange={this.handleChange}
          validateValue={this.validateValue}
          setPage={this.setPage}
        />
        <div style={{ direction: 'ltr' }}>
          <Document
            file={this.props.pdfFile}
            onLoadSuccess={this.onDocumentLoadSuccess}
          >
            <Page
              width={width}
              pageNumber={pageNumber + (-startsFrom) + 1}
              renderAnnotations={false}
              renderTextLayer={false}
            />
          </Document>
        </div>
      </div>
    );
  }
}

export default PDF;

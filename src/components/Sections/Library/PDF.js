import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Document, Page } from 'react-pdf/build/entry.webpack';
import throttle from 'lodash/throttle';
import { Form, Header, Icon, Input, Menu } from 'semantic-ui-react';

class PDF extends Component {
  static propTypes = {
    pdfFile: PropTypes.string.isRequired,
    startsFrom: PropTypes.number.isRequired,
    pageNumber: PropTypes.number.isRequired,
  };

  static defaultProps = {};

  state = {
    numPages: null,
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

  setDivSize = () =>
    this.setState({ width: document.getElementById('pdfWrapper').getBoundingClientRect().width });

  setPage = pageNo => this.setState({ pageNumber: pageNo }, () => {
    this.setState({ inputValue: pageNo });
  });

  firstPage = () => this.setPage(this.props.startsFrom);

  prevPage = () => {
    const page = this.state.pageNumber - 1;
    this.setPage(page > this.props.startsFrom ? page : this.props.startsFrom);
  };

  nextPage = () => {
    const page = this.state.pageNumber + 1;
    const last = this.state.numPages + this.props.startsFrom + -1;
    this.setPage(page < last ? page : last);
  };

  lastPage = () => this.setPage(this.state.numPages + this.props.startsFrom + -1);

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

  // this.setState({ pageNumber: parsed, inputError: false });
  handleChange = (e, { value }) => {
    this.setState({ inputValue: value });
  };

  handleSubmit = () => {
    const value = Number.parseInt(this.state.inputValue, 10);
    if (this.validateValue(value)) {
      this.setPage(value);
    }
  };

  render() {
    const { numPages, pageNumber, width, } = this.state;
    const { startsFrom, }                  = this.props;

    return (
      <div id="pdfWrapper">
        <Header>Total {numPages} pages</Header>
        <Menu compact className="taas-pagination-menu" color="grey" size="mini">
          <Menu.Item onClick={this.firstPage}>{startsFrom} &laquo;</Menu.Item>
          <Menu.Item onClick={this.prevPage}>&lsaquo;</Menu.Item>
          <Form onSubmit={this.handleSubmit}>
            <Input
              icon={<Icon name="search" circular />}
              value={this.state.inputValue}
              error={this.state.inputError}
              onChange={this.handleChange}
            />
          </Form>
          <Menu.Item onClick={this.nextPage}>&rsaquo;</Menu.Item>
          <Menu.Item onClick={this.lastPage}>&raquo; {numPages + startsFrom + -1}</Menu.Item>
        </Menu>
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

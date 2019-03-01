import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Form, Icon, Input, Menu } from 'semantic-ui-react';

class PDFMenu extends Component {
  static propTypes = {
    numPages: PropTypes.number,
    pageNumber: PropTypes.number.isRequired,
    startsFrom: PropTypes.number.isRequired,
    setPage: PropTypes.func.isRequired,
  };

  static defaultProps = {
    numPages: null
  };

  constructor(props) {
    super(props);
    const { pageNumber } = props;
    this.state           = {
      inputValue: pageNumber,
      propsPageNumber: pageNumber,
      inputError: true,
    };
  }

  static getDerivedStateFromProps(nextProps, state) {
    if (nextProps.pageNumber !== state.propsPageNumber) {
      return { inputValue: nextProps.pageNumber, propsPageNumber: nextProps.pageNumber };
    }
    return null;
  }

  componentDidMount() {
    const { pageNumber } = this.props;

    this.setState({ inputValue: pageNumber });
  }

  onKeyDown = (e) => {
    // Enter
    if (e.keyCode === 13) {
      this.handleSubmit();
    }
  };

  handleSubmit = () => {
    const { setPage }    = this.props;
    const { inputValue } = this.state;

    const { validated, parsed } = this.validateValue(inputValue);
    if (validated) {
      setPage(parsed);
    }
  };

  handleChange = (e, { value }) => {
    this.setState({ inputValue: value });
  };

  firstPage = () => {
    const { startsFrom, setPage } = this.props;
    setPage(startsFrom);
  };

  prevPage = () => {
    const { pageNumber, startsFrom, setPage } = this.props;

    const page = pageNumber - 1;
    const last = startsFrom;
    setPage(page > last ? page : last);
  };

  nextPage = () => {
    const { pageNumber, numPages, startsFrom, setPage } = this.props;
    const page                                          = pageNumber + 1;
    const last                                          = numPages + startsFrom + -1;
    setPage(page < last ? page : last);
  };

  lastPage = () => {
    const { numPages, startsFrom, setPage } = this.props;
    setPage(numPages + startsFrom + -1);
  };

  restoreError = () => setTimeout(() => this.setState({ inputError: false }), 5000);

  validateValue = (value) => {
    const bad = { validated: false, parsed: 0 };

    if (value === '') {
      this.setState({ inputError: true }, this.restoreError);
      return bad;
    }

    const parsed = Number.parseInt(value, 10);
    if (Number.isNaN(parsed)) {
      this.setState({ inputError: true }, this.restoreError);
      return bad;
    }

    const { startsFrom, numPages } = this.props;
    const realValue                = parsed + -startsFrom + 1;
    if (realValue < 1 || realValue > numPages) {
      this.setState({ inputError: true }, this.restoreError);
      return bad;
    }

    this.setState({ inputError: false });
    return { validated: true, parsed };
  };

  render() {
    const { startsFrom, numPages }   = this.props;
    const { inputValue, inputError } = this.state;

    return (
      <Menu compact className="taas-pagination-menu" color="grey" size="mini">
        <Menu.Item onClick={this.firstPage}>
          {startsFrom}
          &nbsp;&laquo;
        </Menu.Item>
        <Menu.Item onClick={this.prevPage}>&lsaquo;</Menu.Item>
        <Form>
          <Input
            icon={<Icon name="search" circular link onClick={this.handleSubmit} />}
            value={inputValue}
            error={inputError}
            onChange={this.handleChange}
            onKeyDown={this.onKeyDown}
          />
        </Form>
        <Menu.Item onClick={this.nextPage}>&rsaquo;</Menu.Item>
        <Menu.Item onClick={this.lastPage}>
          &raquo;&nbsp;
          {numPages + startsFrom + -1}
        </Menu.Item>
      </Menu>
    );
  }
}

export default PDFMenu;

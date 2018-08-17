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

  state = {
    inputValue: this.props.pageNumber,
    inputError: true,
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.pageNumber !== this.props.pageNumber) {
      this.setState({ inputValue: nextProps.pageNumber });
    }
  }

  onKeyDown = (e) => {
    // Enter
    if (e.keyCode === 13) {
      this.handleSubmit();
    }
  };

  handleSubmit = () => {
    const value                 = this.state.inputValue;
    const { validated, parsed } = this.validateValue(value);
    if (validated) {
      this.props.setPage(parsed);
    }
  };

  handleChange = (e, { value }) => {
    this.setState({ inputValue: value });
  };

  firstPage = () => this.props.setPage(this.props.startsFrom);

  prevPage = () => {
    const page = this.props.pageNumber - 1;
    const last = this.props.startsFrom;
    this.props.setPage(page > last ? page : last);
  };

  nextPage = () => {
    const page = this.props.pageNumber + 1;
    const last = this.props.numPages + this.props.startsFrom + -1;
    this.props.setPage(page < last ? page : last);
  };

  lastPage = () => this.props.setPage(this.props.numPages + this.props.startsFrom + -1);

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

    const realValue = parsed + -this.props.startsFrom + 1;
    if (realValue < 1 || realValue > this.props.numPages) {
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
        <Menu.Item onClick={this.firstPage}>{startsFrom} &laquo;</Menu.Item>
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
        <Menu.Item onClick={this.lastPage}>&raquo; {numPages + startsFrom + -1}</Menu.Item>
      </Menu>
    );
  }
}

export default PDFMenu;

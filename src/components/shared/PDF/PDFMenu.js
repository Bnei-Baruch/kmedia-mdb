import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Form, Icon, Input, Menu } from 'semantic-ui-react';

class PDFMenu extends Component {
  static propTypes = {
    numPages: PropTypes.number,
    pageNumber: PropTypes.number.isRequired,
    startsFrom: PropTypes.number.isRequired,
    inputValue: PropTypes.number.isRequired,
    inputError: PropTypes.bool.isRequired,
    handleChange: PropTypes.func.isRequired,
    validateValue: PropTypes.func.isRequired,
    setPage: PropTypes.func.isRequired,
  };

  static defaultProps = {
    numPages: null
  };

  handleSubmit = () => {
    const value = this.props.inputValue;
    if (this.props.validateValue(value)) {
      this.props.setPage(value);
    }
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

  render() {
    const { startsFrom, inputValue, inputError, numPages } = this.props;
    const { handleChange, }                                = this.props;

    return (
      <Menu compact className="taas-pagination-menu" color="grey">
        <Menu.Item onClick={this.firstPage}>{startsFrom} &laquo;</Menu.Item>
        <Menu.Item onClick={this.prevPage}>&lsaquo;</Menu.Item>
        <Form onSubmit={this.props.handleSubmit}>
          <Input
            icon={<Icon name="search" circular />}
            value={inputValue}
            error={inputError}
            onChange={handleChange}
          />
        </Form>
        <Menu.Item onClick={this.nextPage}>&rsaquo;</Menu.Item>
        <Menu.Item onClick={this.lastPage}>&raquo; {numPages + startsFrom + -1}</Menu.Item>
      </Menu>
    );
  }
}

export default PDFMenu;

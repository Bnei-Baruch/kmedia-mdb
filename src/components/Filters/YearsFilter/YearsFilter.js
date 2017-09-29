import React from 'react';
import PropTypes from 'prop-types';
import noop from 'lodash/noop';
import range from 'lodash/range';
import { Button, Divider, Dropdown, Segment } from 'semantic-ui-react';

import connectFilter from '../connectFilter';

const buildYearOptions = (fromYear, toYear, order = -1) =>
  range(fromYear, toYear, order).map(year => ({
    value: year,
    text: year
  }));

class YearsFilter extends React.Component {

  static propTypes = {
    onCancel: PropTypes.func,
    onApply: PropTypes.func,
    updateValue: PropTypes.func.isRequired,
    value: PropTypes.number,
    t: PropTypes.func.isRequired,
    namespace: PropTypes.string.isRequired,
    fromYear: PropTypes.number,
    toYear: PropTypes.number,
  };

  static defaultProps = {
    onCancel: noop,
    onApply: noop,
    value: null,
    allValues: [],
    fromYear: 1995,
    toYear: (new Date()).getFullYear(),
  };

  state = {
    year: this.props.value
  };

  componentWillReceiveProps(nextProps) {
    this.setState({
      year: nextProps.value,
    });
  }

  onSelectionChange = (event, data) => {
    const { value } = data;
    this.setState({ year: value });
  };

  onCancel = () => {
    this.props.onCancel();
  };

  apply = () => {
    this.props.updateValue(this.state.year);
    this.props.onApply();
  };

  render() {
    const { fromYear, toYear, t } = this.props;
    const { year }                = this.state;

    return (
      <Segment basic clearing attached="bottom" className="tab active">
        <Dropdown
          selection
          value={year}
          placeholder={t('filters.years-filter.placeholder')}
          options={buildYearOptions(toYear, fromYear)}
          onChange={this.onSelectionChange}
        />
        <Divider />
        <Segment vertical clearing>
          <Button
            primary
            content={t('buttons.apply')}
            floated="right"
            disabled={!year}
            onClick={this.apply}
          />
          <Button
            content={t('buttons.cancel')}
            floated="right"
            onClick={this.onCancel}
          />
        </Segment>
      </Segment>
    );
  }
}

export default connectFilter()(YearsFilter);

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import noop from 'lodash/noop';
import { Button, Grid, Header, Image, Segment } from 'semantic-ui-react';

import { sectionLogo } from '../../../helpers/images';

class SectionsFilter extends Component {
  static propTypes = {
    value: PropTypes.string,
    onCancel: PropTypes.func,
    onApply: PropTypes.func,
    t: PropTypes.func.isRequired,
  };

  static defaultProps = {
    value: null,
    onCancel: noop,
    onApply: noop,
  };

  state = {
    sValue: this.props.value
  };

  componentWillReceiveProps(nextProps) {
    if (this.props.value !== nextProps.value) {
      this.setState({ sValue: nextProps.value });
    }
  }

  onSelectionChange = (section) => {
    this.setState({ sValue: `filters.sections-filter.${section}` });
  };

  onCancel = () => {
    this.props.onCancel();
  };

  apply = () => {
    this.props.onApply(this.state.sValue);
  };

  gridColumn = (x, sValue, t) => (
    <Grid.Column key={x} textAlign="center">
      <Header
        size="small"
        className={(sValue && sValue.endsWith(x)) ? 'active' : ''}
        onClick={() => this.onSelectionChange(x)}
      >
        <Image src={sectionLogo[x]} />
        <br />
        {t(`nav.sidebar.${x}`)}
      </Header>
    </Grid.Column>
  );

  render() {
    const { t }      = this.props;
    const { sValue } = this.state;

    return (
      <Segment.Group className="filter-popup__wrapper">
        <Segment basic secondary className="filter-popup__header">
          <div className="title">
            <Button
              basic
              compact
              size="tiny"
              content={t('buttons.cancel')}
              onClick={this.onCancel}
            />
            <Header size="small" textAlign="center" content={t('filters.sections-filter.label')} />
            <Button
              primary
              compact
              size="small"
              content={t('buttons.apply')}
              disabled={!sValue}
              onClick={this.apply}
            />
          </div>
        </Segment>
        <Segment basic className="filter-popup__body sections-filter">
          <Grid padded stackable columns={5}>
            <Grid.Row>
              {
                ['lessons', 'programs', 'sources', 'events', 'publications'].map(x => this.gridColumn(x, sValue, t))
              }
            </Grid.Row>
          </Grid>
        </Segment>
      </Segment.Group>
    );
  }
}

export default SectionsFilter;

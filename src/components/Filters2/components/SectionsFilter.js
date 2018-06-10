import React, { Component } from 'react';
import PropTypes from 'prop-types';
import noop from 'lodash/noop';
import { Button, Header, Grid, Image, Segment } from 'semantic-ui-react';

import { sectionLogo } from '../../../helpers/images';
import connectFilter from './connectFilter';

class SectionsFilter extends Component {
  static propTypes = {
    namespace: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    value: PropTypes.any,
    onCancel: PropTypes.func,
    onApply: PropTypes.func,
    updateValue: PropTypes.func.isRequired,
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
    this.props.updateValue(this.state.sValue);
    this.props.onApply();
  };

  render() {
    const { name, t } = this.props;
    const { sValue }  = this.state;

    return (
      <Segment.Group>
        <Segment secondary className="filter-popup__header">
          <div className="title">
            <Button
              basic
              compact
              icon="remove"
              onClick={this.onCancel}
            />
            <Header size="small" textAlign="center" content={t(`filters.${name}.label`)} />
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
        <Segment className="filter-popup__body sections-filter">
          <Grid padded stackable columns={5}>
            <Grid.Row>
              {
                ['lessons', 'programs', 'sources', 'events', 'publications'].map(x =>
                  (
                    <Grid.Column key={x} textAlign="center">
                      <Header
                        size="small"
                        className={(sValue && sValue.endsWith(x)) ? 'active' : ''}
                        onClick={() => this.onSelectionChange(x)}
                      >
                        <Image src={sectionLogo[x]} />
                        <br />{t(`nav.sidebar.${x}`)}
                      </Header>
                    </Grid.Column>
                  )
                )
              }
            </Grid.Row>
          </Grid>
        </Segment>
      </Segment.Group>
    );
  }
}

export default connectFilter()(SectionsFilter);

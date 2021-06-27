import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { noop } from '../../../helpers/utils';
import { Button, Grid, Header, Segment } from 'semantic-ui-react';

import { SectionLogo } from '../../../helpers/images';

/*
 * It was used once in SearchResults, but not anymore...
 */
const SectionsFilter = (value = null, onCancel = noop, onApply = noop, t) => {
  const [sValue, setSValue] = useState(value);

  useEffect(() => setSValue(value), [value]);

  const onSelectionChange = section => setSValue(`filters.sections-filter.${section}`);

  const apply = () => onApply(sValue);

  const gridColumn = (x, sValue, t) => (
    <Grid.Column key={x} textAlign="center">
      <Header
        size="small"
        className={(sValue && sValue.endsWith(x)) ? 'active' : ''}
        onClick={() => onSelectionChange(x)}
      >
        <SectionLogo name={x} />
        <br />
        {t(`nav.sidebar.${x}`)}
      </Header>
    </Grid.Column>
  );

  return (
    <Segment.Group className="filter-popup__wrapper">
      <Segment basic secondary className="filter-popup__header">
        <div className="title">
          <Button
            basic
            compact
            size="tiny"
            content={t('buttons.cancel')}
            onClick={onCancel}
          />
          <Header size="small" textAlign="center" content={t('filters.sections-filter.label')} />
          <Button
            primary
            compact
            size="small"
            content={t('buttons.apply')}
            disabled={!sValue}
            onClick={apply}
          />
        </div>
      </Segment>
      <Segment basic className="filter-popup__body sections-filter">
        <Grid padded stackable columns={5}>
          <Grid.Row>
            {
              ['lessons', 'programs', 'sources', 'events', 'publications'].map(x => gridColumn(x, sValue, t))
            }
          </Grid.Row>
        </Grid>
      </Segment>
    </Segment.Group>
  );
};

SectionsFilter.propTypes = {
  value: PropTypes.string,
  onCancel: PropTypes.func,
  onApply: PropTypes.func,
  t: PropTypes.func.isRequired,
};

export default SectionsFilter;

import React from 'react';
import PropTypes from 'prop-types';
import { withNamespaces } from 'react-i18next';
import { Segment } from 'semantic-ui-react';

import * as shapes from '../../../../../shapes';

const Summary = ({ unit, t }) => {
  if (unit.description) {
    return (
      <Segment basic>
        <div dangerouslySetInnerHTML={{ __html: unit.description }} />
      </Segment>
    );
  }

  return <Segment basic>{t('materials.summary.no-summary')}</Segment>;
};

Summary.propTypes = {
  unit: shapes.ContentUnit.isRequired,
  t: PropTypes.func.isRequired,
};

export default withNamespaces()(Summary);

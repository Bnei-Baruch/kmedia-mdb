import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withNamespaces } from 'react-i18next';
import { Segment } from 'semantic-ui-react';

import * as shapes from '../../../../../shapes';

class Summary extends Component {

  static propTypes = {
    unit: shapes.ContentUnit.isRequired,
    t: PropTypes.func.isRequired,
  };

  render() {
    const { unit, t } = this.props;

    if (unit.description) {
      return (
        <Segment basic>
          <div dangerouslySetInnerHTML={{ __html: unit.description }} />
        </Segment>
      );
    }

    return <Segment basic>{t('materials.summary.no-summary')}</Segment>;
  }
}

export default withNamespaces()(Summary);

import React from 'react';
import { useTranslation } from 'react-i18next';
import { Segment } from 'semantic-ui-react';

import * as shapes from '../../../../../shapes';

const Summary = ({ unit }) => {
  const { t } = useTranslation('common', { useSuspense: false });

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
};

export default Summary;

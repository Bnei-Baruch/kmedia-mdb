import React from 'react';

import Helmets from '../../shared/Helmets';
import { wrap as wrapContainer } from '../../Pages/Unit/Container';
import Page from '../../Pages/Unit/Page';

const MyUnitContainer = ({ language, unit, location, wip, err }) => (
  <div>
    <Helmets.AVUnit unit={unit} language={language} />
    <Page
      section="programs"
      unit={wip || err ? null : unit}
      language={language}
      location={location}
      wip={wip}
      err={err}
    />
  </div>
);

export default wrapContainer(MyUnitContainer);

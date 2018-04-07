import React from 'react';

import Helmets from '../../shared/Helmets';
import { UnitContainer, wrap as wrapContainer } from '../../Pages/Unit/Container';
import Page from '../../Pages/Unit/Page';

class MyUnitContainer extends UnitContainer {
  render() {
    const { language, unit, wip, err } = this.props;
    return (
      <div>
        <Helmets.AVUnit unit={unit} />
        <Page
          section="programs"
          unit={wip || err ? null : unit}
          language={language}
          wip={wip}
          err={err}
        />
      </div>
    );
  }
}

export default wrapContainer(MyUnitContainer);

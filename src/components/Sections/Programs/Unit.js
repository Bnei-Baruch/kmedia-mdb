import React from 'react';

import { UnitContainer, wrap as wrapContainer } from '../../pages/Unit/Container';
import Page from '../../pages/Unit/Page';

class MyUnitContainer extends UnitContainer {
  render() {
    const { language, unit, wip, err } = this.props;
    return (
      <Page
        section="programs"
        unit={wip || err ? null : unit}
        language={language}
        wip={wip}
        err={err}
      />
    );
  }
}

export default wrapContainer(MyUnitContainer);

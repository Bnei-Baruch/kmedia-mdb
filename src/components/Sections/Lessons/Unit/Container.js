import React from 'react';

import { UnitContainer, wrap as wrapContainer } from '../../../Pages/Unit/Container';
import { UnitPage, wrap as wrapPage } from '../../../Pages/Unit/Page';

const MyWrappedUnitPage = wrapPage(UnitPage);

class MyUnitContainer extends UnitContainer {
  render() {
    const { language, unit, location, wip, err } = this.props;
    return (
      <MyWrappedUnitPage
        section="lessons"
        unit={wip || err ? null : unit}
        language={language}
        location={location}
        wip={wip}
        err={err}
      />
    );
  }
}

export default wrapContainer(MyUnitContainer);

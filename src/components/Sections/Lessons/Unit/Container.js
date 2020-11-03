import React from 'react';

import { UnitContainer, wrap as wrapContainer } from '../../../Pages/Unit/Container';
import { UnitPage, wrap as wrapPage } from '../../../Pages/Unit/Page';
import WipErr from '../../../shared/WipErr/WipErr';

class MyUnitContainer extends UnitContainer {
  render() {
    const { language, unit, location, wip, err, t } = this.props;

    const wipErr = WipErr({ wip, err, t });
    if (wipErr) {
      return wipErr;
    }

    return (
      <UnitPage
        section="lessons"
        unit={wip || err ? null : unit}
        language={language}
        location={location}
      />
    );
  }
}

export default wrapContainer(wrapPage(MyUnitContainer));

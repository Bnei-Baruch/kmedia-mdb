import React from 'react';

import Helmets from '../../shared/Helmets';
import WipErr from '../../shared/WipErr/WipErr';
import { UnitContainer, wrap as wrapContainer } from '../../Pages/Unit/Container';
import UnitPage, { wrap as wrapPage } from '../../Pages/Unit/Page';

class MyUnitContainer extends UnitContainer {
  render() {
    const { language, unit, location, wip, err, t } = this.props;
    const wipErr = WipErr({ wip, err, t });
    if (wipErr) {
      return wipErr;
    }

    return (
      <div>
        <Helmets.AVUnit unit={unit} language={language} />
        <UnitPage
          section="programs"
          unit={wip || err ? null : unit}
          language={language}
          location={location}
        />
      </div>
    );
  }
}

export default wrapContainer(wrapPage(MyUnitContainer));

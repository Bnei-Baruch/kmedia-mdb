import React from 'react';

import { UnitContainer, wrap as wrapContainer } from '../../Pages/Unit/Container';
import { UnitPage, wrap as wrapPage } from '../../Pages/Unit/Page';
import Info from '../../Pages/Unit/widgets/Info/Info';

class MyUnitPage extends UnitPage {
  renderInfo() {
    const { unit } = this.props;
    return <Info unit={unit} section="" />;
  }
}

const MyWrappedUnitPage = wrapPage(MyUnitPage);

class MyUnitContainer extends UnitContainer {
  render() {
    const { language, unit, wip, err } = this.props;
    return (
      <MyWrappedUnitPage
        section="events"
        unit={wip || err ? null : unit}
        language={language}
        wip={wip}
        err={err}
      />
    );
  }
}

export default wrapContainer(MyUnitContainer);

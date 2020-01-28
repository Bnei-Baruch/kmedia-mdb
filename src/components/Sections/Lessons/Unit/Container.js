import React from 'react';

import { CT_LESSON_PART } from '../../../../helpers/consts';
import { wrap as wrapContainer } from '../../../Pages/Unit/Container';
import { UnitPage, wrap as wrapPage } from '../../../Pages/Unit/Page';
import { SameCollectionContainer, wrap as wrapSameCollectionContainer } from '../../../Pages/Unit/widgets/Recommended/SameCollection/Container';
import SameCollectionLessonPart from './SameCollectionLessonPart';
import SameCollectionLecture from './SameCollectionLecture';

class MySameCollectionContainer extends SameCollectionContainer {
  render() {
    const { unit, collection, wip, err } = this.props;

    let Widget = SameCollectionLessonPart;
    if (unit.content_type !== CT_LESSON_PART) {
      Widget = SameCollectionLecture;
    }

    return (
      <Widget
        unit={unit}
        wip={wip}
        err={err}
        collection={wip || err ? null : collection}
      />
    );
  }
}

const MyWrappedSameCollectionContainer = wrapSameCollectionContainer(MySameCollectionContainer);

class MyUnitPage extends UnitPage {
  renderRecommendations() {
    const { unit } = this.props;
    return <MyWrappedSameCollectionContainer unit={unit} />;
  }
}

const MyWrappedUnitPage = wrapPage(MyUnitPage);

const MyUnitContainer = ({ language, unit, location, wip, err }) => (
  <MyWrappedUnitPage
    section="lessons"
    unit={wip || err ? null : unit}
    language={language}
    location={location}
    wip={wip}
    err={err}
  />
);

export default wrapContainer(MyUnitContainer);

import React from 'react';

import { CT_LESSON_PART } from '../../../../helpers/consts';
import Helmets from '../../../shared/Helmets';
import { UnitContainer, wrap as wrapContainer } from '../../../Pages/Unit/Container';
import { UnitPage, wrap as wrapPage } from '../../../Pages/Unit/Page';
import {
  SameCollectionContainer,
  wrap as wrapSameCollectionContainer
} from '../../../Pages/Unit/widgets/Recommended/SameCollection/Container';
import SameCollectionLessonPart from './SameCollectionLessonPart';
import SameCollectionLecture from './SameCollectionLecture';

class MySameCollectionContainer extends SameCollectionContainer {
  render() {
    const { unit, collection, wip, err, t } = this.props;

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
        t={t}
      />
    );
  }
}

const MyWrappedSameCollectionContainer = wrapSameCollectionContainer(MySameCollectionContainer);

class MyUnitPage extends UnitPage {
  renderHelmet() {
    return <Helmets.AVUnit unit={this.props.unit} language={this.props.language} />;
  }

  renderRecommendations() {
    const { unit, t } = this.props;
    return <MyWrappedSameCollectionContainer unit={unit} t={t} />;
  }
}

const MyWrappedUnitPage = wrapPage(MyUnitPage);

class MyUnitContainer extends UnitContainer {
  render() {
    const { language, unit, wip, err } = this.props;
    return (
      <MyWrappedUnitPage
        section="lessons"
        unit={wip || err ? null : unit}
        language={language}
        wip={wip}
        err={err}
      />
    );
  }
}

export default wrapContainer(MyUnitContainer);

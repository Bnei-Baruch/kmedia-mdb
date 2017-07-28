import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Segment } from 'semantic-ui-react';

import * as shapes from '../../shapes';
import TabsMenu from '../../shared/TabsMenu';

const tPrefix = 'lessons.part.materials';

class Materials extends Component {

  static propTypes = {
    lesson: shapes.LessonPart,
    t: PropTypes.func.isRequired,
  };

  static defaultProps = {
    lesson: undefined,
  };

  render() {
    const { t } = this.props;
    const items = [
      {
        name: 'summary',
        label: t(`${tPrefix}.summary`),
        component: <Segment basic>{t(`${tPrefix}.summary`)}</Segment>,
      },
      {
        name: 'transcription',
        label: t(`${tPrefix}.transcription`),
        component: <Segment basic>{t(`${tPrefix}.transcription`)}</Segment>,
      },
      {
        name: 'sources',
        label: t(`${tPrefix}.sources`),
        component: <Segment basic>{t(`${tPrefix}.sources`)}</Segment>,
      },
      {
        name: 'sketches',
        label: t(`${tPrefix}.sketches`),
        component: <Segment basic>{t(`${tPrefix}.sketches`)}</Segment>,
      },
    ];

    return (
      <TabsMenu items={items} />
    );
  }
}

export default Materials;

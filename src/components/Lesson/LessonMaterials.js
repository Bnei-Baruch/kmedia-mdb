import React, { Component } from 'react';
import { Segment } from 'semantic-ui-react';

import * as shapes from '../shapes';
import TabsMenu from '../shared/TabsMenu';

class LessonMaterials extends Component {

  static propTypes = {
    lesson: shapes.LessonPart,
  };

  static defaultProps = {
    lesson: undefined,
  };

  render() {
    const items = [
      {
        name: 'summary',
        label: 'Summary',
        component: <Segment basic>Summary</Segment>,
      },
      {
        name: 'transcription',
        label: 'Transcription',
        component: <Segment basic>Transcription</Segment>,
      },
      {
        name: 'sources',
        label: 'Sources',
        component: <Segment basic>Sources</Segment>,
      },
      {
        name: 'sketches',
        label: 'Sketches',
        component: <Segment basic>Sketches</Segment>,
      },
    ];

    return (
      <TabsMenu items={items} />
    );
  }
}

export default LessonMaterials;

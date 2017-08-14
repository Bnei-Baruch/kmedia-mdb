import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Segment } from 'semantic-ui-react';

import * as shapes from '../../shapes';
import TabsMenu from '../../shared/TabsMenu';

const tPrefix = 'programs.part.materials';

class Materials extends Component {

  static propTypes = {
    chapter: shapes.ProgramChapter,
    t: PropTypes.func.isRequired,
  };

  static defaultProps = {
    chapter: undefined,
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
    ];

    return (
      <TabsMenu items={items} />
    );
  }
}

export default Materials;

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Segment } from 'semantic-ui-react';

import * as shapes from '../../shapes';
import TabsMenu from '../../shared/TabsMenu';
import Summary from './Summary/Summary';
import SourcesContainer from './Sources/SourcesContainer';
import TranscriptionContainer from './Transcription/TranscriptionContainer';

class Materials extends Component {

  static propTypes = {
    unit: shapes.ContentUnit,
    t: PropTypes.func.isRequired,
  };

  static defaultProps = {
    unit: undefined,
  };

  render() {
    const { unit, t } = this.props;

    if (!unit) {
      return null;
    }

    const items = [
      {
        name: 'summary',
        label: t('materials.summary.header'),
        component: <Summary unit={this.props.unit} t={t} />,
      },
      {
        name: 'transcription',
        label: t('materials.transcription.header'),
        component: <TranscriptionContainer unit={this.props.unit} t={t} />
      },
      {
        name: 'sources',
        label: t('materials.sources.header'),
        component: <SourcesContainer unit={this.props.unit} t={t} />
      },
      {
        name: 'sketches',
        label: t('materials.sketches.header'),
        component: <Segment basic>{t('materials.sketches.header')}</Segment>,
        // component: <div style="outerWidth=200px; outerHeight=200px" visible="true"><Sketches></Sketches></div>,
      },
    ];

    return (
      <TabsMenu items={items} />
    );
  }
}

export default Materials;

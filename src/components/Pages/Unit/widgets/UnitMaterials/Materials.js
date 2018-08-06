import React, { Component } from 'react';
import PropTypes from 'prop-types';

import * as shapes from '../../../../shapes';
import TabsMenu from '../../../../shared/TabsMenu';
import Summary from './Summary/Summary';
import SourcesContainer from './Sources/SourcesContainer';
import Sketches from './Sketches';
import TranscriptionContainer from './Transcription/TranscriptionContainer';
import {CT_VIDEO_PROGRAM_CHAPTER} from '../../../../../helpers/consts';

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
        component: <Sketches unit={this.props.unit} t={t} />,
      },
    ];

    if (this.props.unit.content_type === CT_VIDEO_PROGRAM_CHAPTER)
    {
      items.unshift({
        name: 'summary',
        label: t('materials.summary.header'),
        component: <Summary unit={this.props.unit} t={t} />,
      });
    }

    return (
      <div className="unit-materials">
        <TabsMenu items={items} />
      </div>
    );
  }
}

export default Materials;

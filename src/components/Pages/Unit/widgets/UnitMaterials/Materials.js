import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withNamespaces } from 'react-i18next';

import { CT_ARTICLE, CT_RESEARCH_MATERIAL, CT_VIDEO_PROGRAM_CHAPTER, MT_TEXT } from '../../../../../helpers/consts';
import * as shapes from '../../../../shapes';
import TabsMenu from '../../../../shared/TabsMenu';
import Summary from './Summary/Summary';
import SourcesContainer from './Sources/SourcesContainer';
import Sketches from './Sketches';
import TranscriptionContainer from './Transcription/TranscriptionContainer';

class Materials extends Component {
  static propTypes = {
    unit: shapes.ContentUnit,
    t: PropTypes.func.isRequired,
  };

  static defaultProps = {
    unit: undefined,
  };

  derivedTextUnits() {
    const { unit } = this.props;
    const types    = {};

    Object.values(unit.derived_units || {})
      .forEach(x => types[x.content_type] = (x.files || []).some(f => f.type === MT_TEXT));

    return types;
  }

  render() {
    const { unit, t } = this.props;

    if (!unit) {
      return null;
    }

    const derivedTexts = this.derivedTextUnits();
    const items        = [
      {
        name: 'transcription',
        label: t('materials.transcription.header'),
        component: <TranscriptionContainer unit={unit} key="transcription" />
      },
      {
        name: 'sources',
        label: t('materials.sources.header'),
        component: <SourcesContainer unit={unit} />
      },
      {
        name: 'sketches',
        label: t('materials.sketches.header'),
        component: <Sketches unit={unit} />,
      },
    ];

    if (unit.content_type === CT_VIDEO_PROGRAM_CHAPTER) {
      items.unshift({
        name: 'summary',
        label: t('materials.summary.header'),
        component: <Summary unit={unit} />,
      });
    }

    if (unit.content_type === CT_VIDEO_PROGRAM_CHAPTER && derivedTexts[CT_ARTICLE]) {
      items.push({
        name: 'articles',
        label: t('materials.articles.header'),
        component: <TranscriptionContainer unit={unit} key="articles" type="articles" />
      });
    }

    if (unit.content_type === CT_VIDEO_PROGRAM_CHAPTER && derivedTexts[CT_RESEARCH_MATERIAL]) {
      items.push({
        name: 'research',
        label: t('materials.research.header'),
        component: <TranscriptionContainer unit={unit} key="research" type="research" />
      });
    }

    return (
      <div className="unit-materials">
        <TabsMenu items={items} />
      </div>
    );
  }
}

export default withNamespaces()(Materials);

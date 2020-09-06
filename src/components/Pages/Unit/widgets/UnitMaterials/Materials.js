import React from 'react';
import PropTypes from 'prop-types';
import { withNamespaces } from 'react-i18next';

import { CT_ARTICLE, CT_RESEARCH_MATERIAL, CT_VIDEO_PROGRAM_CHAPTER, CT_VIRTUAL_LESSON, DERIVED_UNITS_CONTENT_TYPE, MT_TEXT } from '../../../../../helpers/consts';
import * as shapes from '../../../../shapes';
import TabsMenu from '../../../../shared/TabsMenu';
import Summary from './Summary/Summary';
import SourcesContainer from './Sources/SourcesContainer';
import Sketches from './Sketches';
import MediaDownloads from '../Downloads/MediaDownloads';
import TranscriptionContainer from './Transcription/TranscriptionContainer';
import { isEmpty } from '../../../../../helpers/utils';
import DerivedUnits from './DerivedUnits';

const derivedTextUnits = (unit) => {
  const types    = {};
  const callback = (x) => {
    types[x.content_type] = (x.files || []).some(f => f.type === MT_TEXT);
  };

  Object.values(unit.derived_units || {})
    .forEach(callback);

  return types;
};

const Materials = ({ unit = undefined, t }) => {
  if (!unit) {
    return null;
  }

  const derivedTexts = derivedTextUnits(unit);
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
    {
      name: 'downloads',
      label: t('media-downloads.title'),
      component: <MediaDownloads unit={unit} />
    }
  ];

  if (unit.content_type === CT_VIDEO_PROGRAM_CHAPTER || unit.content_type === CT_VIRTUAL_LESSON) {
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

  if (!isEmpty(unit.derived_units)) {
    const selectedUnits = Object.values(unit.derived_units).filter(u => DERIVED_UNITS_CONTENT_TYPE.includes(u.content_type));
    if (selectedUnits.length > 0) {
      items.push({
        name: 'derived',
        label: t('materials.derived-units.header'),
        component: <DerivedUnits selectedUnits={selectedUnits} key="derived" type="derived" t={t}/>
      });
    }
  }

  return (
    <div className="unit-materials">
      <TabsMenu items={items} />
    </div>
  );
};

Materials.propTypes = {
  unit: shapes.ContentUnit,
  t: PropTypes.func.isRequired,
};

export default withNamespaces()(Materials);

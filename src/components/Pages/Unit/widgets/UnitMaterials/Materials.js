import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { withNamespaces } from 'react-i18next';

import {
  CT_ARTICLE,
  CT_RESEARCH_MATERIAL,
  CT_VIDEO_PROGRAM_CHAPTER,
  CT_VIRTUAL_LESSON,
  CT_CLIP,
  DERIVED_UNITS_CONTENT_TYPE,
  MT_TEXT
} from '../../../../../helpers/consts';
import * as shapes from '../../../../shapes';
import TabsMenu from '../../../../shared/TabsMenu';
import Summary from './Summary/Summary';
import SourcesContainer from './Sources/SourcesContainer';
import Sketches from './Sketches';
import MediaDownloads from '../Downloads/MediaDownloads';
import TranscriptionContainer from './Transcription/TranscriptionContainer';
import { isEmpty } from '../../../../../helpers/utils';
import { DeviceInfoContext } from '../../../../../helpers/app-contexts';
import DerivedUnits from './DerivedUnits';
import Recommended from '../Recommended/Main/Recommended';

const derivedTextUnits = unit => {
  const types    = {};
  const callback = x => {
    types[x.content_type] = (x.files || []).some(f => f.type === MT_TEXT);
  };

  Object.values(unit.derived_units || {})
    .forEach(callback);

  return types;
};

const Materials = ({ unit = undefined, t, playlistComponent = null }) => {
  const { isMobileDevice } = useContext(DeviceInfoContext);

  if (!unit) {
    return null;
  }

  const derivedTexts = derivedTextUnits(unit);
  const items        = [
    {
      name: 'downloads',
      label: t('media-downloads.title'),
      component: <MediaDownloads unit={unit} />
    },
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

  if ([CT_VIDEO_PROGRAM_CHAPTER, CT_VIRTUAL_LESSON, CT_CLIP].includes(unit.content_type)) {
    items.unshift({
      name: 'summary',
      label: t('materials.summary.header'),
      component: <Summary unit={unit} />,
    });
  }

  if (isMobileDevice) {
    const item = playlistComponent === null
      ? {
        name: 'recommended',
        label: t('materials.recommended.header'),
        component: <Recommended unit={unit} displayTitle={false} />
      }
      : {
        name: 'playlist',
        label: t('materials.playlist.header'),
        component: playlistComponent()
      }

    items.unshift(item);
  }

  if (unit.content_type === CT_VIDEO_PROGRAM_CHAPTER && derivedTexts[CT_ARTICLE]) {
    items.push({
      name: 'articles',
      label: t('materials.articles.header'),
      component: <TranscriptionContainer unit={unit} key="articles" type="articles" activeTab="articles" />
    });
  }

  if (unit.content_type === CT_VIDEO_PROGRAM_CHAPTER && derivedTexts[CT_RESEARCH_MATERIAL]) {
    items.push({
      name: 'research',
      label: t('materials.research.header'),
      component: <TranscriptionContainer unit={unit} key="research" type="research" activeTab="research" />
    });
  }

  if (!isEmpty(unit.derived_units)) {
    const selectedUnits = Object.values(unit.derived_units).filter(u => DERIVED_UNITS_CONTENT_TYPE.includes(u.content_type));
    if (selectedUnits.length > 0) {
      items.push({
        name: 'derived',
        label: t('materials.derived-units.header'),
        component: <DerivedUnits selectedUnits={selectedUnits} key="derived" type="derived" t={t} />
      });
    }
  }

  return <TabsMenu items={items} />
};

Materials.propTypes = {
  unit: shapes.ContentUnit,
  t: PropTypes.func.isRequired,
};

export default withNamespaces()(Materials);

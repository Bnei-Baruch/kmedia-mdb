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
import Sources from './Sources/Sources';
import Sketches from './Sketches';
import MediaDownloads from '../MediaDownloads';
import TranscriptionContainer from './Transcription/TranscriptionContainer';
import { isEmpty, noop } from '../../../../../helpers/utils';
import { ClientChroniclesContext, DeviceInfoContext } from '../../../../../helpers/app-contexts';
import DerivedUnits from './DerivedUnits';
import Recommended from '../Recommended/Main/Recommended';
import { useSelector } from 'react-redux';
import { selectors } from '../../../../../redux/modules/playlist';
import { selectors as mdb } from '../../../../../redux/modules/mdb';

const derivedTextUnits = unit => {
  const types    = {};
  const callback = x => {
    types[x.content_type] = (x.files || []).some(f => f.type === MT_TEXT);
  };

  Object.values(unit.derived_units || {})
    .forEach(callback);

  return types;
};

const Materials = ({ t, playlistComponent = null }) => {
  const { isMobileDevice } = useContext(DeviceInfoContext);
  const chronicles         = useContext(ClientChroniclesContext);

  const { cuId } = useSelector(state => selectors.getInfo(state.playlist));
  const unit     = useSelector(state => mdb.getDenormContentUnit(state.mdb, cuId));

  if (!unit) {
    return null;
  }

  const derivedTexts     = derivedTextUnits(unit);
  const chroniclesAppend = chronicles ? chronicles.append.bind(chronicles) : noop;
  const items            = [
    {
      name: 'transcription',
      label: t('materials.transcription.header'),
      component: <TranscriptionContainer unit={unit} key="transcription" />
    },
    (![CT_CLIP, CT_VIDEO_PROGRAM_CHAPTER].includes(unit.content_type)) && {
      name: 'sources',
      label: t('materials.sources.header'),
      component: <Sources unit={unit} />
    },
    {
      name: 'sketches',
      label: t('materials.sketches.header'),
      component: <Sketches unit={unit} />,
    },
    {
      name: 'downloads',
      label: t('media-downloads.title'),
      component: <MediaDownloads unit={unit} chroniclesAppend={chroniclesAppend} />
    }
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
        label: t('materials.recommended.default'),
        component: <Recommended unit={unit} displayTitle={false} />
      }
      : {
        name: 'playlist',
        label: t('materials.playlist.header'),
        component: playlistComponent
      };

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

  return <TabsMenu items={items.filter(x => !!x)} />;
};

Materials.propTypes = {
  unit: shapes.ContentUnit,
  t: PropTypes.func.isRequired,
};

export default withNamespaces()(Materials);

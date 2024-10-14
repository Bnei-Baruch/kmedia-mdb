import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import {
  CT_ARTICLE,
  CT_RESEARCH_MATERIAL,
  CT_VIDEO_PROGRAM_CHAPTER,
  CT_CLIP,
  DERIVED_UNITS_CONTENT_TYPE,
  MT_TEXT
} from '../../../../../helpers/consts';
import * as shapes from '../../../../shapes';
import TabsMenu from '../../../../shared/TabsMenu';
import Summary from './Summary/Summary';
import { showSummaryTab } from './Summary/helper';
import SourceTab from './Sources/SourceTab';
import Sketches from './Sketches/Sketches';
import MediaDownloads from '../MediaDownloads';
import { isEmpty, noop } from '../../../../../helpers/utils';
import { ClientChroniclesContext, DeviceInfoContext } from '../../../../../helpers/app-contexts';
import DerivedUnits from './DerivedUnits';
import Recommended from '../Recommended/Main/Recommended';
import PlaylistItems from '../../Playlist/PlaylistItems';
import PlaylistMyItems from '../../PlaylistMy/PlaylistItems';
import {
  mdbGetDenormContentUnitSelector,
  playlistGetInfoSelector,
  settingsGetContentLanguagesSelector
} from '../../../../../redux/selectors';
import TranscriptionTab from './Transcription/TranscriptionTab';
import ArticleTab from './Article/ArticleTab';
import ResearchTab from './Research/ResearchTab';

const derivedTextUnits = unit => {
  const types    = {};
  const callback = x => {
    types[x.content_type] = (x.files || []).some(f => f.type === MT_TEXT);
  };

  Object.values(unit.derived_units || {})
    .forEach(callback);

  return types;
};

const Materials = ({ t }) => {
  const { isMobileDevice } = useContext(DeviceInfoContext);
  const chronicles         = useContext(ClientChroniclesContext);

  const { id: paramsId }              = useParams();
  const { cuId, isSingleMedia, isMy } = useSelector(playlistGetInfoSelector);
  const unit                          = useSelector(state => mdbGetDenormContentUnitSelector(state, cuId || paramsId));
  const contentLanguages              = useSelector(settingsGetContentLanguagesSelector);

  if (!unit) return null;

  const derivedTexts     = derivedTextUnits(unit);
  const chroniclesAppend = chronicles ? chronicles.append.bind(chronicles) : noop;
  const items            = [
    {
      name     : 'transcription',
      label    : t('materials.transcription.header'),
      component: <TranscriptionTab id={unit.id}/>
    },
    (![CT_CLIP, CT_VIDEO_PROGRAM_CHAPTER].includes(unit.content_type)) && {
      name     : 'sources',
      label    : t('materials.sources.header'),
      component: <SourceTab id={unit.id}/>
    },
    {
      name     : 'sketches',
      label    : t('materials.sketches.header'),
      component: <Sketches unit={unit}/>,
    },
    {
      name     : 'downloads',
      label    : t('media-downloads.title'),
      component: <MediaDownloads unit={unit} chroniclesAppend={chroniclesAppend}/>
    }
  ];

  if (showSummaryTab(unit, contentLanguages)) {
    items.unshift({
      name     : 'summary',
      label    : t('materials.summary.header'),
      component: <Summary id={unit.id}/>,
    });
  }

  if (isMobileDevice) {
    const item = isSingleMedia
      ? {
        name     : 'recommended',
        label    : t('materials.recommended.default'),
        component: <Recommended cuId={unit.id} displayTitle={false}/>
      }
      : {
        name     : 'playlist',
        label    : t('materials.playlist.header'),
        component: isMy ? <PlaylistMyItems/> : <PlaylistItems/>
      };

    items.unshift(item);
  }

  if (derivedTexts[CT_ARTICLE]) {
    items.push({
      name     : 'articles',
      label    : t('materials.articles.header'),
      component: <ArticleTab id={unit.id}/>
    });
  }

  if (unit.content_type === CT_VIDEO_PROGRAM_CHAPTER && derivedTexts[CT_RESEARCH_MATERIAL]) {
    items.push({
      name     : 'research',
      label    : t('materials.research.header'),
      component: <ResearchTab id={unit.id}/>
    });
  }

  if (!isEmpty(unit.derived_units)) {
    const selectedUnits = Object.values(unit.derived_units).filter(u => DERIVED_UNITS_CONTENT_TYPE.includes(u.content_type));
    if (selectedUnits.length > 0) {
      items.push({
        name     : 'derived',
        label    : t('materials.derived-units.header'),
        component: <DerivedUnits selectedUnits={selectedUnits} key="derived" type="derived" t={t}/>
      });
    }
  }

  return <TabsMenu items={items.filter(x => !!x)}/>;
};

Materials.propTypes = {
  unit: shapes.ContentUnit,
  t   : PropTypes.func.isRequired
};

export default withTranslation()(Materials);

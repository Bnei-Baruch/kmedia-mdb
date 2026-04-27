import groupBy from 'lodash/groupBy';
import React from 'react';

import {
  CT_ARTICLE,
  CT_CLIP,
  CT_DAILY_LESSON,
  CT_FULL_LESSON,
  CT_KITEI_MAKOR,
  CT_LELO_MIKUD,
  CT_LESSON_PART,
  CT_VIDEO_PROGRAM_CHAPTER,
  CT_VIRTUAL_LESSON,
  LANGUAGES,
  MT_AUDIO,
  MT_VIDEO,
  NO_NAME,
  UNIT_EVENTS_TYPE,
  UNIT_PROGRAMS_TYPE,
  UNIT_PUBLICATIONS_TYPE,
  VS_NAMES,
} from '../../../helpers/consts';
import { SectionLogo } from '../../../helpers/images';
import { canonicalLink } from '../../../helpers/links';
import { formatTime } from '../../../helpers/time';
import { canonicalCollection, downloadLink, isEmpty } from '../../../helpers/utils';
import Link from '../../Language/MultiLanguageLink';
import { sizeByQuality } from '../../Pages/WithPlayer/widgets/helper';

const CT_DAILY_LESSON_I18N_KEY = `constants.content-types.${CT_DAILY_LESSON}`;

const getI18nTypeOverridesKey = contentType => {
  switch (contentType) {
    case CT_LESSON_PART:
    case CT_FULL_LESSON:
      return 'lesson.';
    case CT_VIDEO_PROGRAM_CHAPTER:
      return 'program.';
    case CT_ARTICLE:
      return 'publication.';
    default:
      return '';
  }
};

const sortMediaFilesOrder = {
  audio: 1,
  'lelo-mikud': 2,
  KITEI_MAKOR: 3,
  videonHD: 4,
  videoHD: 5,
  videofHD: 6,
  text: 7,
  image: 8,
};

const sortMediaFiles = (a, b) => {
  const typeA = a.type === 'video' ? a.type + a.video_size : a.type;
  const typeB = b.type === 'video' ? b.type + b.video_size : b.type;

  return (sortMediaFilesOrder[typeA] - sortMediaFilesOrder[typeB]) || 0;
};

const labelTextByFile = (file, contentType, t) => {
  if (file.type === CT_KITEI_MAKOR) {
    return t(`constants.content-types.${CT_KITEI_MAKOR}`);
  }

  const typeOverrides = getI18nTypeOverridesKey(contentType);
  const fileType = ['audio', 'video'].includes(file.type) ? `${file.type}-simple` : file.type;
  const label = t(`media-downloads.${typeOverrides}type-labels.${fileType}`);
  if (file.video_size) {
    return `${label} [${VS_NAMES[file.video_size]}]`;
  }

  return label;
};

const renderHorizontalFilesList = (language, files, contentType, t, chroniclesAppend) => {
  const html = files.map(file => {
    const url = downloadLink(file);
    const label = labelTextByFile(file, contentType, t);
    return (
      <li key={`${file.id}_${file.type}_${file.video_size}_${file.language}`} className="media-file-button">
        <div>
          <a href={url} onClick={() => chroniclesAppend('download', { url, uid: file.id })}>
            {label} ({file.language})
            <div className="file-list-icon inline-block">
              <SectionLogo name="downloads" />
            </div>
          </a>
        </div>
      </li>
    );
  });

  html.unshift(
    <li key={`language`} className="list-first-item">
      {LANGUAGES[language].name}:&#8194;
      <nbsp />
    </li>
  );

  return html;
};

const filesForRenderByUnit = unit => {
  const leloMikudFiles = unitDerivedFiles(
    unit,
    'lelo-mikud',
    key => key.includes(CT_LELO_MIKUD),
    () => true
  );
  const kiteiMakorFiles = unitDerivedFiles(
    unit,
    'KITEI_MAKOR',
    key => key.includes(CT_KITEI_MAKOR),
    f => f?.mimetype?.includes(MT_AUDIO)
  );
  const files = prepareHlsFiles(unit);

  return [...files, ...leloMikudFiles, ...kiteiMakorFiles];
};

const prepareHlsFiles = ({ files = [], content_type }) => {
  const hls = files.find(f => f.video_size === 'HLS' && f.hls_languages && f.video_qualities);
  if (!hls) return files;

  return hls.hls_languages.reduce((acc, l) => {
    acc.push({ ...hls, type: MT_AUDIO, language: l, name: 'audio.mp3', video_size: null });
    if (content_type !== CT_KITEI_MAKOR) {
      hls.video_qualities.forEach(q => {
        const f = {
          ...hls,
          type: MT_VIDEO,
          video_size: q,
          language: l,
          size: sizeByQuality(q, hls.duration),
        };
        acc.push(f);
      });
    }

    return acc;
  }, []);
};

const unitDerivedFiles = (unit, type, keyFilter, mimeFilter) => {
  const keys = Object.keys(unit.derived_units || {}).filter(keyFilter);
  if (isEmpty(keys)) {
    return [];
  }

  const du = unit.derived_units[keys[0]];
  return du?.files ? du.files.filter(mimeFilter).map(file => ({ ...file, type })) : [];
};

const sortByMediaFunc = (contentLanguages, originalLanguage) => (a, b) => {
  const media = sortMediaFiles(a, b);
  if (media !== 0) {
    return media;
  }

  const lang = contentLanguages.indexOf(a.language) - contentLanguages.indexOf(b.language);
  if (lang !== 0) {
    if (a.language === originalLanguage) {
      return -1;
    }

    if (b.language === originalLanguage) {
      return 1;
    }

    return lang;
  }

  return 0;
};

// TODO: bbdev REFACTOR THIS TO COMMON LIBRARY
const bestFileByContentLanguages = (files, contentLanguages, originalLanguage) => {
  const filtered = files
    .filter(file => contentLanguages.includes(file.language))
    .sort(sortByMediaFunc(contentLanguages, originalLanguage))
    .filter((file, index, files) => {
      if (index === 0) {
        return true;
      }

      const media = sortMediaFiles(files[index - 1], files[index]);
      const diffLanguages = files[index - 1].language !== files[index].language;
      return media !== 0 || diffLanguages;
    });
  const languages = Array.from(new Set(filtered.map(item => item.language)));
  return languages.map(language => ({
    language,
    files: filtered.filter(file => file.language === language),
  }));
};

const renderUnits = (units, contentLanguages, t, helpChooseLang, chroniclesAppend) =>
  units
    .filter(unit => unit)
    .map((unit, index, unitsArray) => {
      const lastUnit = unitsArray.length - 1;
      const filesSets = bestFileByContentLanguages(
        filesForRenderByUnit(unit),
        contentLanguages,
        unit.original_language
      );
      const files =
        filesSets &&
        filesSets.map(set =>
          renderHorizontalFilesList(set.language, set.files, unit.content_type, t, chroniclesAppend)
        );
      const duration = unit.duration ? formatTime(unit.duration) : null;

      if (!files) {
        return null;
      }

      const to = canonicalLink(unit);
      let title;
      if (
        unit.content_type === CT_VIDEO_PROGRAM_CHAPTER ||
        unit.content_type === CT_CLIP ||
        unit.content_type === CT_VIRTUAL_LESSON
      ) {
        const description = [];
        const ccu = canonicalCollection(unit);
        const part = Number(ccu?.ccuNames[unit.id]);
        part && description.push(t('pages.unit.info.episode', { name: part }));
        if (duration) description.push(duration);

        title = (
          <div className="unit-header font-bold">
            <div className="margin-bottom-4">
              <Link className="unit-link" to={to}>
                {ccu?.name || NO_NAME}
              </Link>
              <span className="duration">{description.join('  |  ')}</span>
            </div>
            <Link className="unit-link" to={to}>
              {unit.name || NO_NAME}
            </Link>
          </div>
        );
      } else {
        title = (
          <div className="unit-header font-bold">
            <Link className="unit-link" to={to}>
              {unit.name || NO_NAME}
            </Link>
            {duration && <span className="duration">{duration}</span>}
          </div>
        );
      }

      return (
        <li key={unit.id} className="unit-header">
          <div>
            {title}
            {files.length > 0 ? (
              files.map(f => <ul className={`horizontal-list remove-bottom-border`} key={f.id}>{f}</ul>)
            ) : (
              <ul className={`horizontal-list ${index === lastUnit ? 'remove-bottom-border' : ''}`}>
                <li key={`${unit.id}-no-files`} className="no-files">
                  <SectionLogo name="info" />
                  <div className="margin-right-8 margin-left-8">
                    <span className="bold-font">{t('simple-mode.no-files-found-for-lang')}</span>
                    <br />
                    {t('simple-mode.try-different-language')}
                    <button className="choose-language-button" onClick={helpChooseLang}>
                      {t('simple-mode.language-click')}
                    </button>
                  </div>
                </li>
              </ul>
            )}
          </div>
        </li>
      );
    });

export const renderCollection = (collection, contentLanguages, t, helpChooseLang, chroniclesAppend) => {
  const { number, id, content_units } = collection;
  if (!content_units) {
    return null;
  }

  const units = renderUnits(collection.content_units, contentLanguages, t, helpChooseLang, chroniclesAppend);

  return (
    <div className="rounded shadow border w-full" key={id}>
      <div className={`p-4 ${number ? 'gray-header' : ''}`}>
        <div className="font-bold large unit-header">
          <Link to={canonicalLink(collection)}>
            {`${t(CT_DAILY_LESSON_I18N_KEY)}${number ? ` (${t(`lessons.list.nameByNum_${number}`)})` : ''}`}
          </Link>
        </div>
      </div>
      <div className="p-4 border-t">
        <ul>{units}</ul>
      </div>
    </div>
  );
};

export const matchIconToType = type => {
  switch (type) {
    case 'programs':
    case 'events':
    case 'publications':
      return type;
    default:
      return 'lectures';
  }
};

const renderOtherCollection = (title, collectionArray, contentLanguages, t, helpChooseLang, chroniclesAppend) => {
  const items = Object.values(collectionArray).map(u =>
    renderUnits(u, contentLanguages, t, helpChooseLang, chroniclesAppend)
  );
  const icon = matchIconToType(title.toLowerCase());

  return (
    <div key={title}>
      {items.length ? (
        <div className="type-header-top-margin">
          <h2>
            <div className="simple-mode-type-icon inline-block">
              <SectionLogo name={icon} />
            </div>
            {t(`nav.sidebar.${title.toLowerCase()}`)}
          </h2>
          <div className="rounded shadow border w-full">
            <div className="p-4">
              <ul className="large">{items}</ul>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export const mergeTypesToCollections = byType => {
  const collections = {
    LESSONS: [],
    EVENTS: [],
    PROGRAMS: [],
    PUBLICATIONS: [],
  };

  Object.keys(byType).forEach(type => {
    if (UNIT_PROGRAMS_TYPE.includes(type)) {
      collections.PROGRAMS.push([...byType[type]]);
    } else if (UNIT_EVENTS_TYPE.includes(type)) {
      collections.EVENTS.push([...byType[type]]);
    } else if (UNIT_PUBLICATIONS_TYPE.includes(type)) {
      collections.PUBLICATIONS.push([...byType[type]]);
    } else {
      collections.LESSONS.push([...byType[type]]);
    }
  });

  return collections;
};

export const groupOtherMediaByType = (collection, contentLanguages, t, helpChooseLang, chroniclesAppend) => {
  const byType = groupBy(collection, 'content_type');
  const mergedCollections = mergeTypesToCollections(byType);
  return Object.entries(mergedCollections).map(([title, coll]) =>
    renderOtherCollection(title, coll, contentLanguages, t, helpChooseLang, chroniclesAppend)
  );
};

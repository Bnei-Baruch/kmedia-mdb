import React from 'react';
import groupBy from 'lodash/groupBy';
import { Button, Card, Image, List } from 'semantic-ui-react';

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
  MT_AUDIO,
  NO_NAME,
  UNIT_EVENTS_TYPE,
  UNIT_PROGRAMS_TYPE,
  UNIT_PUBLICATIONS_TYPE,
  VS_NAMES,
  MT_VIDEO,
  LANGUAGES
} from '../../../helpers/consts';
import { canonicalLink } from '../../../helpers/links';
import { canonicalCollection, isEmpty, downloadLink } from '../../../helpers/utils';
import { formatTime } from '../../../helpers/time';
import Link from '../../Language/MultiLanguageLink';
import { SectionLogo } from '../../../helpers/images';
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
  audio        : 1,
  'lelo-mikud' : 2,
  'KITEI_MAKOR': 3,
  videonHD     : 4,
  videoHD      : 5,
  videofHD     : 6,
  text         : 7,
  image        : 8,
};

const sortMediaFiles = (a, b) => {
  const typeA = a.type === 'video' ? a.type + a.video_size : a.type;
  const typeB = b.type === 'video' ? b.type + b.video_size : b.type;

  return (sortMediaFilesOrder[typeA] - sortMediaFilesOrder[typeB]) ?? 0;
};

const labelTextByFile = (file, contentType, t) => {
  if (file.type === CT_KITEI_MAKOR) {
    return t(`constants.content-types.${CT_KITEI_MAKOR}`);
  }

  const typeOverrides = getI18nTypeOverridesKey(contentType);
  const fileType      = ['audio', 'video'].includes(file.type) ? `${file.type}-simple` : file.type;
  const label         = t(`media-downloads.${typeOverrides}type-labels.${fileType}`);
  if (file.video_size) {
    return `${label} [${VS_NAMES[file.video_size]}]`;
  }

  return label;
};

const renderHorizontalFilesList = (language, files, contentType, t, chroniclesAppend) => {
  const html = files.map(file => {
    const url   = downloadLink(file);
    const label = labelTextByFile(file, contentType, t);
    return (
      <List.Item key={`${file.id}_${file.type}_${file.video_size}_${file.language}`}
        className="media-file-button">
        <List.Content>
          <a href={url} onClick={() => chroniclesAppend('download', { url, uid: file.id })}>
            {label} ({file.language})
            <Image className="file-list-icon">
              <SectionLogo name="downloads"/>
            </Image>
          </a>
        </List.Content>
      </List.Item>
    );
  });

  html.unshift(
    <List.Item key={`language`} class='list-first-item'>
      {LANGUAGES[language].name}:&#8194;
      <nbsp/>
    </List.Item>
  );

  return html;
};

const filesForRenderByUnit = unit => {
  const leloMikudFiles  = unitDerivedFiles(unit, 'lelo-mikud', key => key.includes(CT_LELO_MIKUD), () => true);
  const kiteiMakorFiles = unitDerivedFiles(unit, 'KITEI_MAKOR', key => key.includes(CT_KITEI_MAKOR), f => f?.mimetype?.includes(MT_AUDIO));
  const files           = prepareHlsFiles(unit);

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
          type      : MT_VIDEO,
          video_size: q,
          language  : l,
          size      : sizeByQuality(q, hls.duration)
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
  return du?.files
    ? du.files.filter(mimeFilter).map(file => ({ ...file, type }))
    : [];
};

const sortByMediaFunc = (contentLanguages, originalLanguage) => (a, b) => {
  // sort by media type (i.e. files in all languages are sorted by media type first)
  const media = sortMediaFiles(a, b);
  if (media !== 0) {
    return media;
  }

  // inside media type group sort by language (original language is preferable)
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
// Order files by types and languages; remove some duplicates
const bestFileByContentLanguages = (files, contentLanguages, originalLanguage) => {
  const filtered  = files
    // filter by requested languages
    .filter(file => contentLanguages.includes(file.language))
    .sort(sortByMediaFunc(contentLanguages, originalLanguage))
    // Remove duplicated media types on the same language
    .filter((file, index, files) => {
      if (index === 0) {
        return true;
      }

      const media         = sortMediaFiles(files[index - 1], files[index]);
      const diffLanguages = files[index - 1].language !== files[index].language;
      return media !== 0 || diffLanguages;
    });
  const languages = Array.from(new Set(filtered.map(item => item.language)));
  return languages.map(language => ({
    language,
    files: filtered.filter(file => file.language === language)
  }));
};

const renderUnits = (units, contentLanguages, t, helpChooseLang, chroniclesAppend) => (
  units.filter(unit => unit).map((unit, index, unitsArray) => {
    const lastUnit  = unitsArray.length - 1;
    const filesSets = bestFileByContentLanguages(filesForRenderByUnit(unit), contentLanguages, unit.original_language);
    const files     = filesSets && filesSets.map(set => renderHorizontalFilesList(set.language, set.files, unit.content_type, t, chroniclesAppend));
    const duration  = !!unit.duration ? formatTime(unit.duration) : null;

    if (!files) {
      return null;
    }

    const to = canonicalLink(unit);
    let title;
    if (unit.content_type === CT_VIDEO_PROGRAM_CHAPTER || unit.content_type === CT_CLIP || unit.content_type === CT_VIRTUAL_LESSON) {
      const description = [];
      const ccu         = canonicalCollection(unit);
      const part        = Number(ccu?.ccuNames[unit.id]);
      part && description.push(t('pages.unit.info.episode', { name: part }));
      if (!!duration)
        description.push(duration);

      title = (
        <List.Header className="unit-header">
          <div className="margin-bottom-4">
            <Link className="unit-link" to={to}>{ccu?.name || NO_NAME}</Link>
            <span className="duration">{description.join('  |  ')}</span>
          </div>
          <Link className="unit-link" to={to}>{unit.name || NO_NAME}</Link>
        </List.Header>
      );
    } else {
      title = (
        <List.Header className="unit-header">
          <Link className="unit-link" to={to}>{unit.name || NO_NAME}</Link>
          {
            duration && <span className="duration">{duration}</span>
          }
        </List.Header>
      );
    }

    return (
      <List.Item key={unit.id} className="unit-header">
        <List.Content>
          {title}
          {
            files.length > 0
              ? files.map(f => <List.List
                className={`horizontal-list remove-bottom-border`}>{f}</List.List>)
              : (
                <List.List className={`horizontal-list ${index === lastUnit ? 'remove-bottom-border' : ''}`}>
                  <List.Item key={`${unit.id}-no-files`} className="no-files">
                    <SectionLogo name="info"/>
                    <List.Content className="margin-right-8 margin-left-8">
                      <span className="bold-font">{t('simple-mode.no-files-found-for-lang')}</span>
                      <br/>
                      {t('simple-mode.try-different-language')}
                      <Button
                        className="choose-language-button"
                        onClick={helpChooseLang}>{t('simple-mode.language-click')}
                      </Button>
                    </List.Content>
                  </List.Item>
                </List.List>
              )
          }
        </List.Content>
      </List.Item>
    );
  })
);

export const renderCollection = (collection, contentLanguages, t, helpChooseLang, chroniclesAppend) => {
  const { number, id, content_units } = collection;
  if (!content_units) {
    return null;

  }

  const units = renderUnits(collection.content_units, contentLanguages, t, helpChooseLang, chroniclesAppend);

  return (
    <Card fluid key={id}>
      <Card.Content className={number ? 'gray-header' : ''}>
        <Card.Header className="unit-header">
          <Link to={canonicalLink(collection)}>
            {`${t(CT_DAILY_LESSON_I18N_KEY)}${number ? ` (${t(`lessons.list.nameByNum_${number}`)})` : ''}`}
          </Link>
        </Card.Header>
      </Card.Content>
      <Card.Content extra>
        <List>
          {units}
        </List>
      </Card.Content>
    </Card>
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
  const items = Object.values(collectionArray).map(u => renderUnits(u, contentLanguages, t, helpChooseLang, chroniclesAppend));
  const icon  = matchIconToType(title.toLowerCase());

  return (
    <div key={title}>
      {
        items.length
          ? (
            <div className="type-header-top-margin">
              <h2>
                <Image className="simple-mode-type-icon">
                  <SectionLogo name={icon}/>
                </Image>
                {t(`nav.sidebar.${title.toLowerCase()}`)}
              </h2>
              <Card fluid>
                <Card.Content>
                  <List size="large">
                    {items}
                  </List>
                </Card.Content>
              </Card>
            </div>
          )
          : null
      }
    </div>
  );
};

export const mergeTypesToCollections = byType => {
  const collections = {
    LESSONS     : [],
    EVENTS      : [],
    PROGRAMS    : [],
    PUBLICATIONS: []
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
  const byType            = groupBy(collection, 'content_type');
  const mergedCollections = mergeTypesToCollections(byType);
  return Object.entries(mergedCollections).map(([title, coll]) => renderOtherCollection(title, coll, contentLanguages, t, helpChooseLang, chroniclesAppend));
};

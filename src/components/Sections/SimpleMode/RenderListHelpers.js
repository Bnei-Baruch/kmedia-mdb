import React from 'react';
import groupBy from 'lodash/groupBy';
import { Button, Card, Image, List } from 'semantic-ui-react';

import {
  CT_ARTICLE,
  CT_DAILY_LESSON,
  CT_FULL_LESSON,
  CT_KITEI_MAKOR,
  CT_LESSON_PART,
  CT_VIDEO_PROGRAM_CHAPTER,
  MT_AUDIO,
  NO_NAME,
  UNIT_EVENTS_TYPE,
  UNIT_PROGRAMS_TYPE,
  UNIT_PUBLICATIONS_TYPE,
  VS_NAMES
} from '../../../helpers/consts';
import { canonicalLink } from '../../../helpers/links';
import { isEmpty, physicalFile } from '../../../helpers/utils';
import { formatTime } from '../../../helpers/time';
import Link from '../../Language/MultiLanguageLink';
import { SectionLogo } from '../../../helpers/images';

const CT_DAILY_LESSON_I18N_KEY = `constants.content-types.${CT_DAILY_LESSON}`;

const getI18nTypeOverridesKey = (contentType) => {
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

const sortMediaFiles = files => (
  files.sort((a, b) => {
    const order = { audio: 0, 'lelo-mikud': 1, 'KITEI_MAKOR': 2, videonHD: 3, videoHD: 4, text: 5, image: 6 };
    const typeA = a.type === 'video' ? a.type + a.video_size : a.type;
    const typeB = b.type === 'video' ? b.type + b.video_size : b.type;

    return order[typeA] - order[typeB];
  })
);

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

const renderHorizontalFilesList = (files, contentType, t) => (
  sortMediaFiles(files).map((file) => {
    const url   = physicalFile(file);
    const label = labelTextByFile(file, contentType, t);
    return (
      <List.Item key={file.id} className="media-file-button">
        <List.Content>
          <a href={url}>
            {label}
            <Image className="file-list-icon">
              <SectionLogo name='downloads' />
            </Image>
          </a>
        </List.Content>
      </List.Item>
    );
  })
);

const filesForRenderByUnit = (unit) => {
  const keys = Object.keys(unit.derived_units || {}).filter(key => key.includes(CT_KITEI_MAKOR));
  if (isEmpty(keys)) {
    return [];
  }

  const du = unit.derived_units[keys[0]];

  let leloMikudFiles  = [];
  let kiteiMakorFiles = [];
  if (du?.files) {
    kiteiMakorFiles = du.files.filter(f => f?.mimetype?.includes(MT_AUDIO)).map(file => ({ ...file, type: 'KITEI_MAKOR' }));
    leloMikudFiles  = du.files.map(file => ({ ...file, type: 'lelo-mikud' }));
  }
  return [...(unit.files || []), ...leloMikudFiles, ...kiteiMakorFiles];
};

const renderUnits = (units, language, t, helpChooseLang) => (
  units.filter((unit => unit)).map((unit, index, unitsArray) => {
    const lastUnit  = unitsArray.length - 1;
    const filesList = filesForRenderByUnit(unit).filter(file => file.language === language);
    const files     = filesList && renderHorizontalFilesList(filesList, unit.content_type, t);
    const duration  = formatTime(unit.duration);

    if (!files) {
      return null;
    }

    return (
      <List.Item key={unit.id} className="unit-header">
        <List.Content>
          <List.Header className="unit-header">
            <Link className="unit-link" to={canonicalLink(unit)}>{unit.name || NO_NAME}</Link>
            &nbsp;&nbsp;
            <span className="duration">{duration}</span>
          </List.Header>
          <List.List className={`horizontal-list ${index === lastUnit ? 'remove-bottom-border' : ''}`}>
            {
              files.length
                ? files
                : (
                  <List.Item key={unit.id} className="no-files">
                    <Image>
                      <SectionLogo name='info' />
                    </Image>
                    <List.Content>
                      <span className="bold-font">{t('simple-mode.no-files-found-for-lang')}</span>
                      <br />
                      {t('simple-mode.try-different-language')}
                      <Button className="choose-language-button" onClick={helpChooseLang}>{t('simple-mode.language-click')}</Button>
                    </List.Content>
                  </List.Item>
                )
            }
          </List.List>
        </List.Content>
      </List.Item>
    );
  })
);

export const renderCollection = (collection, language, t, helpChooseLang) => {
  if (!collection.content_units) {
    return null;
  }

  const units = renderUnits(collection.content_units, language, t, helpChooseLang);

  return (
    <Card fluid key={collection.id}>
      <Card.Content className={collection.number ? 'gray-header' : ''}>
        <Card.Header className="unit-header">
          <Link to={canonicalLink(collection)}>
            {`${t(CT_DAILY_LESSON_I18N_KEY)}${collection.number ? ` ${t('lessons.list.number')}${collection.number}` : ''}`}
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

export const matchIconToType = (type) => {
  switch (type) {
  case 'programs':
  case 'events':
  case 'publications':
    return type;
  default:
    return 'lectures';
  }
};

export const renderOtherCollection = (title, collectionArray, language, t, helpChooseLang) => {
  const items = Object.values(collectionArray).map(u => renderUnits(u, language, t, helpChooseLang));
  const icon  = matchIconToType(title.toLowerCase());

  return (
    <div key={title}>
      {
        items.length
          ? (
            <div className="type-header-top-margin">
              <h2>
                <Image className="simple-mode-type-icon">
                  <SectionLogo name={icon} />
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

export const mergeTypesToCollections = (byType) => {
  const collections = {
    LESSONS: [],
    EVENTS: [],
    PROGRAMS: [],
    PUBLICATIONS: []
  };

  Object.keys(byType).forEach((type) => {
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

export const groupOtherMediaByType = (collection, language, t, helpChooseLang) => {
  const byType            = groupBy(collection, 'content_type');
  const mergedCollections = mergeTypesToCollections(byType);
  return Object.entries(mergedCollections).map(([title, coll]) => renderOtherCollection(title, coll, language, t, helpChooseLang));
};

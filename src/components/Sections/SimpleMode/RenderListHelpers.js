import React from 'react';
import groupBy from 'lodash/groupBy';
import { Card, List } from 'semantic-ui-react';

import {
  CT_ARTICLE,
  CT_DAILY_LESSON,
  CT_FULL_LESSON,
  CT_LESSON_PART,
  CT_VIDEO_PROGRAM_CHAPTER,
  NO_NAME,
  VS_NAMES
} from '../../../helpers/consts';
import { canonicalLink } from '../../../helpers/links';
import { physicalFile } from '../../../helpers/utils';
import Link from '../../../components/Language/MultiLanguageLink';

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

const sortMediaFiles = files =>
  files.sort((a, b) => {
    const order = { audio: 0, videonHD: 1, videoHD: 2, text: 3, image: 4 };
    const typeA = a.type === 'video' ? a.type + a.video_size : a.type;
    const typeB = b.type === 'video' ? b.type + b.video_size : b.type;

    return order[typeA] - order[typeB];
  });

const renderHorizontalFilesList = (files, contentType, t) =>
  sortMediaFiles(files).map((file) => {
    const typeOverrides = getI18nTypeOverridesKey(contentType);
    const url           = physicalFile(file);
    const fileType      = ['audio', 'video'].includes(file.type) ? `${file.type}-simple` : file.type;
    let label           = t(`media-downloads.${typeOverrides}type-labels.${fileType}`);
    if (file.video_size) {
      label = `${label} [${VS_NAMES[file.video_size]}]`;
    }

    return (
      <List.Item key={file.id} className="media-file-button">
        <List.Content>
          <a href={url}>{label}</a>
          <List.Icon name="angle double down" />
        </List.Content>
      </List.Item>
    );
  });

const renderUnits = (units, language, t) =>
  units.map((unit) => {
    const filesList = unit && unit.files.filter(file => file.language === language);
    const files     = filesList && renderHorizontalFilesList(filesList, unit.content_type, t);

    if (!files) {
      return null;
    }

    return (
      <List.Item key={unit.id} className="unit-header">
        <List.Content>
          <List.Header className="unit-header">
            <Link className="unit-link" to={canonicalLink(unit)}>{unit.name || NO_NAME}</Link>
          </List.Header>
          <List.List className="horizontal-list">
            {
              files.length ?
                files :
                <span className="no-files">{t('simple-mode.no-files-found-for-lang')}</span>
            }
            <div className="overflow-gradient"></div>
          </List.List>
        </List.Content>
      </List.Item>
    );
  });

export const renderCollection = (collection, language, t) => {
  if (!collection.content_units) {
    return null;
  }

  const units = renderUnits(collection.content_units, language, t);

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

export const groupOtherMediaByType = (collection, language, t) => {
  const byType = groupBy(collection, 'content_type');
  return Object.values(byType).map(v => renderUnits(v, language, t));
};

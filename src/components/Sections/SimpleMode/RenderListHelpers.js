import React from 'react';
import { Card, List } from 'semantic-ui-react';

import groupBy from 'lodash/groupBy';
import {
  CT_ARTICLE,
  CT_DAILY_LESSON,
  CT_FULL_LESSON,
  CT_LESSON_PART,
  CT_VIDEO_PROGRAM_CHAPTER,
  NO_NAME,
  VS_NAMES
} from '../../../helpers/consts';

const CT_DAILY_LESSON_I18N_KEY = `constants.content-types.${CT_DAILY_LESSON}`;
const CDN_URL                  = process.env.REACT_APP_CDN_URL;

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

const chooseIconByFileType = (type) => {
  switch (type) {
  case 'video':
    return 'video play';

  case 'audio':
    return 'volume up';

  default:
    return 'file alternate';
  }
};

const renderHorizontalFilesList = (files, contentType, t) => {
  const list = [];

  files.forEach((file) => {
    const typeOverrides = getI18nTypeOverridesKey(contentType);
    const url           = CDN_URL + file.id;
    const icon          = chooseIconByFileType(file.type);
    let label           = t(`media-downloads.${typeOverrides}type-labels.${file.type}`);
    if (file.video_size) {
      label = `${label} [${VS_NAMES[file.video_size]}]`;
    }

    list.push((
      <List.Item key={`f-${file.id}`} className="media-file-button">
        <List.Content>
          <List.Icon name={icon} />
          <a href={url}>{label}</a>
        </List.Content>
      </List.Item>
    ));
  });

  return list;
};

const renderUnitsListForDesktop = (units, language, t) =>
  units.map((unit) => {
    const filesList = unit.files.filter(file => file.language === language);
    const files     = renderHorizontalFilesList(filesList, unit.content_type, t);

    return (
      <List.Item key={`u-${unit.id}`} className="unit-header">
        <List.Content>
          <List.Header className="unit-header"> {unit.name || NO_NAME}</List.Header>
          <List.List className="horizontal-list">
            {files.length ? files : <span className="no-files">{t('simple-mode.no-files-found')}</span>}
          </List.List>
        </List.Content>
      </List.Item>
    );
  });

const renderUnitsListForMobile = (units, language, t) =>
  units.map((unit) => {
    const filesList = unit.files.filter(file => file.language === language);
    const files     = renderHorizontalFilesList(filesList, unit.content_type, t);

    return (
      <Card key={`u-${unit.id}`}>
        <Card.Content>
          <Card.Header className="unit-header">{unit.name || NO_NAME}</Card.Header>
        </Card.Content>
        <Card.Content extra>
          <List.List className="horizontal-list">
            {files.length ? files : <span className="no-files">{t('simple-mode.no-files-found')}</span>}
          </List.List>
        </Card.Content>
      </Card>
    );
  });

export const renderCollection = (collection, language, t, isMobile) => {
  if (!collection.content_units) {
    return;
  }

  const renderUnitsFunction = isMobile ? renderUnitsListForMobile : renderUnitsListForDesktop;
  const units               = renderUnitsFunction(collection.content_units, language, t);

  return (
    <List.Item key={`c-${collection.id}`} className="no-thumbnail">
      <List.Header className="unit-header under-line no-margin">
        {`${t(CT_DAILY_LESSON_I18N_KEY)}${collection.number ? ` ${t('lessons.list.number')}${collection.number}` : ''}`}
      </List.Header>
      <List.List>
        {units}
      </List.List>
    </List.Item>
  );
};

export const groupOtherMediaByType = (collection, language, t, isMobile) => {
  const contentTypesObject  = groupBy(collection, 'content_type');
  const rows                = [];
  const renderUnitsFunction = isMobile ? renderUnitsListForMobile : renderUnitsListForDesktop;

  Object.keys(contentTypesObject).forEach((type) => {
    rows.push(renderUnitsFunction(contentTypesObject[type], language, t));
  });

  return rows;
};

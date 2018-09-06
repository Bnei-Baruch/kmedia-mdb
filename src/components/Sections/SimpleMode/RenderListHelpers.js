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

const renderHorizontalFilesList = (files, contentType, t) =>
  files.map((file) => {
    const typeOverrides = getI18nTypeOverridesKey(contentType);
    const url           = physicalFile(file);
    const icon          = chooseIconByFileType(file.type);
    let label           = t(`media-downloads.${typeOverrides}type-labels.${file.type}`);
    if (file.video_size) {
      label = `${label} [${VS_NAMES[file.video_size]}]`;
    }

    return (
      <List.Item key={file.id} className="media-file-button">
        <List.Content>
          <List.Icon name={icon} />
          <a href={url}>{label}</a>
        </List.Content>
      </List.Item>
    );
  });

const renderUnitsDesktop = (units, language, t) =>
  units.map((unit) => {
    const filesList = unit.files.filter(file => file.language === language);
    const files     = renderHorizontalFilesList(filesList, unit.content_type, t);

    return (
      <List.Item key={unit.id} className="unit-header">
        <List.Content>
          <List.Header className="unit-header">
            <Link to={canonicalLink(unit)}>{unit.name || NO_NAME}</Link>
          </List.Header>
          <List.List className="horizontal-list">
            {
              files.length ?
                files :
                <span className="no-files">{t('simple-mode.no-files-found')}</span>
            }
          </List.List>
        </List.Content>
      </List.Item>
    );
  });

const renderUnitsMobile = (units, language, t) =>
  units.map((unit) => {
    const filesList = unit.files.filter(file => file.language === language);
    const files     = renderHorizontalFilesList(filesList, unit.content_type, t);

    return (
      <Card key={unit.id}>
        <Card.Content>
          <Card.Header className="unit-header">
            <Link to={canonicalLink(unit)}>{unit.name || NO_NAME}</Link>
          </Card.Header>
        </Card.Content>
        <Card.Content extra>
          <List.List className="horizontal-list">
            {
              files.length ?
                files :
                <span className="no-files">{t('simple-mode.no-files-found')}</span>
            }
          </List.List>
        </Card.Content>
      </Card>
    );
  });

export const renderCollection = (collection, language, t, isMobile) => {
  if (!collection.content_units) {
    return null;
  }

  const renderUnits = isMobile ? renderUnitsMobile : renderUnitsDesktop;
  const units       = renderUnits(collection.content_units, language, t);

  return (
    <List.Item key={collection.id} className="no-thumbnail">
      <List.Header className="unit-header under-line no-margin">
        <Link to={canonicalLink(collection)}>
          {`${t(CT_DAILY_LESSON_I18N_KEY)}${collection.number ? ` ${t('lessons.list.number')}${collection.number}` : ''}`}
        </Link>
      </List.Header>
      <List.List>
        {units}
      </List.List>
    </List.Item>
  );
};

export const groupOtherMediaByType = (collection, language, t, isMobile) => {
  const renderUnits = isMobile ? renderUnitsMobile : renderUnitsDesktop;
  const byType      = groupBy(collection, 'content_type');
  return Object.values(byType).map(v => renderUnits(v, language, t));
};

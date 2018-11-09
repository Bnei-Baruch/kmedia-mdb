import React from 'react';
import groupBy from 'lodash/groupBy';
import { Card, Image, List } from 'semantic-ui-react';
import DownloadIcon from '../../../images/icons/download.svg';
import InfoIcon from '../../../images/icons/info.svg';

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
import { isEmpty, physicalFile } from '../../../helpers/utils';
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
    const order = { audio: 0, 'lelo-mikud': 1, videonHD: 2, videoHD: 3, text: 4, image: 5 };
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
          <a href={url}>{label} <Image className="file-list-icon" src={DownloadIcon} /></a>
        </List.Content>
      </List.Item>
    );
  });

const unitLeloMikudFiles = (unit) => {
  const keys = Object.keys(unit.derived_units).filter(key => key.includes('LELO_MIKUD'));
  if (isEmpty(keys)) {
    return [];
  }

  const du = unit.derived_units[keys[0]];
  return du ?
    du.files.map(file => ({ ...file, type: 'lelo-mikud' })) :
    [];
};

const renderUnits = (units, language, t) =>
  units.filter((unit => unit)).map((unit, index, unitsArray) => {
    const lastUnit       = unitsArray.length - 1;
    const leloMikudFiles = unitLeloMikudFiles(unit);
    const filesList      = [...(unit.files || []), ...leloMikudFiles].filter(file => file.language === language);
    const files          = filesList && renderHorizontalFilesList(filesList, unit.content_type, t);

    if (!files) {
      return null;
    }

    return (
      <List.Item key={unit.id} className="unit-header">
        <List.Content>
          <List.Header className="unit-header">
            <Link className="unit-link" to={canonicalLink(unit)}>{unit.name || NO_NAME}</Link>
          </List.Header>
          <List.List className={`horizontal-list ${index === lastUnit ? 'remove-bottom-border' : ''}`}>
            {
              files.length ?
                files :
                <List.Item key={unit.id} className="no-files">
                  <Image src={InfoIcon} />
                  <List.Content>
                    <span className="bold-font">{t('simple-mode.no-files-found-for-lang')}</span>
                    <br />
                    {t('simple-mode.try-different-language')}
                  </List.Content>
                </List.Item>
            }
            <div className="overflow-gradient" />
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

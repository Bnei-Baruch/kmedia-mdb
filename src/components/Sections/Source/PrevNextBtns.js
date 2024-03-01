import React, { useContext } from 'react';
import { useSelector } from 'react-redux';
import { Button, Icon } from 'semantic-ui-react';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';

import { isTaas } from '../../shared/PDF/helper';
import { getFullPath, fixPrevNextZoharTaas } from './helper';
import Link from '../../Language/MultiLanguageLink';
import { getIndex } from './TOC/TOC';
import {
  textPageGetSubjectSelector,
  textPageGetTextOnlySelector,
  sourcesGetPathByIDSelector,
  settingsGetUIDirSelector,
  sourcesGetSourceByIdSelector,
  textPageGetFileSelector
} from '../../../redux/selectors';
import { DeviceInfoContext } from '../../../helpers/app-contexts';

const PrevNextBtns = () => {
  const { isMobileDevice } = useContext(DeviceInfoContext);

  const { id } = useSelector(textPageGetSubjectSelector);
  const { isPdf } = useSelector(textPageGetFileSelector);
  const textOnly = useSelector(textPageGetTextOnlySelector);
  const getPathByID = useSelector(sourcesGetPathByIDSelector);
  const getSourceById = useSelector(sourcesGetSourceByIdSelector);

  if (isTaas(id) && isPdf) {
    return null;
  }

  const fullPath = getFullPath(id, getPathByID);
  const len = fullPath.length;
  if (len < 2) {
    return null;
  }

  const index = getIndex(fullPath[len - 2], fullPath[len - 1]);
  if (index === -1) {
    return null;
  }

  const { children } = fullPath[len - 2];
  const prevId = children[index - 1] || fixPrevNextZoharTaas(fullPath, getSourceById, -1);
  const nextId = children[index + 1] || fixPrevNextZoharTaas(fullPath, getSourceById);

  return (
    <div className={clsx('source_prev_next', {
      'text_align_to_text': (!isMobileDevice),
      'text_align_to_text_text_only': textOnly && (!isMobileDevice)
    })}>
      {prevId && <PrevBtn id={prevId} />}
      <span />
      {nextId && <NextBtn id={nextId} />}
    </div>
  );
};

const PrevBtn = ({ id }) => {
  const { t } = useTranslation();

  const uiDir = useSelector(settingsGetUIDirSelector);
  const getSourceById = useSelector(sourcesGetSourceByIdSelector);
  const icon = (uiDir === 'ltr' ? 'backward' : 'forward');

  const source = getSourceById(id);

  const Padding = uiDir !== 'ltr' ? '16px 24px 16px 32px' : '16px 32px 16px 24px'
  return (
    <Button primary icon
      as={Link}
      to={`sources/${id}`}
      size="medium"
      title={source.name}
      style={{ marginLeft: 0, padding: '0' }}>
      <div style={{ display: 'flex', alignItems: 'center', fontWeight: '500', padding: Padding, fontSize: '16px' }}>
        <Icon name={icon} style={{ marginRight: '8px', marginLeft: '8px' }} />
        {t('buttons.previous-article')}
      </div>
    </Button>
  );
};

const NextBtn = ({ id }) => {
  const { t } = useTranslation();

  const uiDir = useSelector(settingsGetUIDirSelector);
  const getSourceById = useSelector(sourcesGetSourceByIdSelector);
  const icon = (uiDir !== 'ltr' ? 'backward' : 'forward');

  const source = getSourceById(id);

  const Padding = uiDir !== 'ltr' ? '16px 32px 16px 24px' : '16px 24px 16px 32px'

  return (
    <Button primary icon
      as={Link}
      to={`sources/${id}`}
      size="medium"
      title={source.name}
      style={{ marginLeft: 0, padding: '0' }}>
      <div style={{ display: 'flex', alignItems: 'center', fontWeight: '500', padding: Padding, fontSize: '16px' }}>
        {t('buttons.next-article')}
        <Icon name={icon} className="custom-icon" style={{ marginLeft: '8px', marginRight: '8px' }} />
      </div>
    </Button>
  );
};

export default PrevNextBtns;

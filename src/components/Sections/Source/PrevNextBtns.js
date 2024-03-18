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

  const { id }         = useSelector(textPageGetSubjectSelector);
  const { isPdf }      = useSelector(textPageGetFileSelector);
  const textOnly       = useSelector(textPageGetTextOnlySelector);
  const getPathByID    = useSelector(sourcesGetPathByIDSelector);
  const getSourceById  = useSelector(sourcesGetSourceByIdSelector);

  if (isTaas(id) && isPdf) {
    return null;
  }

  const fullPath = getFullPath(id, getPathByID);
  const len      = fullPath.length;
  if (len < 2) {
    return null;
  }

  const index = getIndex(fullPath[len - 2], fullPath[len - 1]);
  if (index === -1) {
    return null;
  }

  const { children } = fullPath[len - 2];
  const prevId       = children[index - 1] || fixPrevNextZoharTaas(fullPath, getSourceById, -1);
  const nextId       = children[index + 1] || fixPrevNextZoharTaas(fullPath, getSourceById);

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
  const { isMobileDevice } = useContext(DeviceInfoContext);

  const uiDir         = useSelector(settingsGetUIDirSelector);
  const getSourceById = useSelector(sourcesGetSourceByIdSelector);
  const icon          = uiDir === 'ltr' ? 'chevron left' : 'chevron right';

  const source = getSourceById(id);

  const arrowSide           = uiDir === 'ltr'? 'left' : 'right';
  const btnContentClassName = `btn-content prev ${arrowSide}`;

  return (
    <Button 
      primary icon 
      as={Link} 
      to={`sources/${id}`} 
      size="medium" 
      title={source.name} 
      className="prev-next-btn"
    >
      <div className={btnContentClassName}>
        <Icon name={icon} className="prev-next-btn-icon"/>
        {isMobileDevice ? (''): (<span>{t('buttons.previous-article')}</span>)}
      </div>
    </Button>
  );
};

const NextBtn = ({ id }) => {
  const { t } = useTranslation();
  const { isMobileDevice } = useContext(DeviceInfoContext);

  const uiDir         = useSelector(settingsGetUIDirSelector);
  const getSourceById = useSelector(sourcesGetSourceByIdSelector);
  const icon          = uiDir !== 'ltr' ? 'chevron left' : 'chevron right';

  const source              = getSourceById(id);
  const arrowSide           = uiDir === 'ltr'? 'right' : 'left';
  const btnContentClassName = `btn-content next ${arrowSide}`;


  return (
    <Button 
      primary icon 
      as={Link} 
      to={`sources/${id}`} 
      size="medium" 
      title={source.name} 
      className="prev-next-btn"
    >
      <div className={btnContentClassName}>
      {isMobileDevice ? (''): (<span>{t('buttons.next-article')}</span>)}
        <Icon name={icon} className="prev-next-btn-icon"/>
      </div>
    </Button>
  );
};

export default PrevNextBtns;

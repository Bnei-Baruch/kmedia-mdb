'use client';
import { isTaas } from '../../shared/PDF/PDF';
import React from 'react';
import { getIndex } from './TOC';
import { Button } from 'semantic-ui-react';
import { useSelector } from 'react-redux';
import { selectors as sources, selectors as sourcesSelectors } from '../../../../lib/redux/slices/sourcesSlice';
import { getFullPath } from './helper';
import { useTranslation } from 'next-i18next';
import { selectors as settings } from '../../../../lib/redux/slices/settingsSlice';
import Link from 'next/link';
import { selectors } from '../../../../lib/redux/slices/textFileSlice/textFileSlice';

const getNextPrevDetails = (isNext, uiDir, t) => {
  const title         = isNext ? t('buttons.next-article') : t('buttons.previous-article');
  const labelPosition = isNext ? 'right' : 'left';
  const icon          = isNext ? (uiDir === 'ltr' ? 'forward' : 'backward') : (uiDir === 'ltr' ? 'backward' : 'forward');
  const buttonAlign   = isNext ? (uiDir === 'ltr' ? 'right' : 'left') : (uiDir === 'ltr' ? 'left' : 'right');

  return { title, labelPosition, buttonAlign, icon };
};

const NextPrevBtn = ({ sourceChld = [], index, isNext }) => {
  const { t }         = useTranslation();
  const getSourceById = useSelector(state => sourcesSelectors.getSourceById(state.sources));
  const uiDir         = useSelector(state => settings.getUIDir(state.settings));

  if (index < 0 || index > sourceChld.length - 1) {
    return null;
  }

  const { title, labelPosition, buttonAlign, icon } = getNextPrevDetails(isNext, uiDir, t);

  const sourceId = sourceChld[index];
  const source   = getSourceById(sourceId);

  return (
    <Button
      as={Link}
      href={`${sourceId}`}
      className={`library__nextPrevButton align-${buttonAlign}`}
      size="mini"
      icon={icon}
      labelPosition={labelPosition}
      content={title}
      title={source.name} />
  );
};

const NextPrev = () => {
  const id          = useSelector(state => selectors.getSubjectInfo(state.textFile).id);
  const getPathByID = useSelector(state => sources.getPathByID(state.sources));

  if (isTaas(id)) {
    return null;
  }

  const fullPath = getFullPath(id, getPathByID);

  const len = fullPath.length;

  if (len < 2) {
    return null;
  }

  const activeIndex = getIndex(fullPath[len - 2], fullPath[len - 1]);
  if (activeIndex === -1) {
    return null;
  }

  const { children } = fullPath[len - 2];
  return (
    <div className="library__nextPrevButtons">
      <NextPrevBtn sourceChld={children} index={activeIndex - 1} isNext={false} />
      <NextPrevBtn sourceChld={children} index={activeIndex + 1} isNext={true} />
    </div>
  );

};
export default NextPrev;

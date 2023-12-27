import React from 'react';
import { useSelector } from 'react-redux';
import { selectors as textPage } from '../../../redux/modules/textPage';
import { isTaas } from '../../shared/PDF/PDF';
import { getFullPath } from './TOC/helper';
import { selectors as sources, selectors } from '../../../redux/modules/sources';
import { selectors as settings } from '../../../redux/modules/settings';
import { Button } from 'semantic-ui-react';
import Link from '../../Language/MultiLanguageLink';
import { getIndex } from './TOC/TOC';
import { useTranslation } from 'react-i18next';

const PrevNextBtns = () => {
  const { id }      = useSelector(state => textPage.getSubject(state.textPage));
  const getPathByID = useSelector(state => sources.getPathByID(state.sources));

  if (isTaas(id)) {
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
  const prevId       = children[index - 1];
  const nextId       = children[index + 1];

  return (
    <div className="source_prev_next text_align_to_text">
      {prevId && <PrevBtn id={prevId} />}
      <span />
      {nextId && <NextBtn id={nextId} />}
    </div>
  );
};

const PrevBtn = ({ id }) => {
  const { t } = useTranslation();

  const uiDir         = useSelector(state => settings.getUIDir(state.settings));
  const getSourceById = useSelector(state => selectors.getSourceById(state.sources));
  const icon          = (uiDir === 'ltr' ? 'backward' : 'forward');

  const source = getSourceById(id);
  return (
    <Button
      as={Link}
      to={`sources/${id}`}
      size="mini"
      icon={icon}
      labelPosition="left"
      content={t('buttons.previous-article')}
      title={source.name}
    />
  );
};
const NextBtn = ({ id }) => {
  const { t } = useTranslation();

  const uiDir         = useSelector(state => settings.getUIDir(state.settings));
  const getSourceById = useSelector(state => selectors.getSourceById(state.sources));
  const icon          = (uiDir !== 'ltr' ? 'backward' : 'forward');

  const source = getSourceById(id);

  return (
    <Button
      as={Link}
      to={`sources/${id}`}
      size="mini"
      icon={icon}
      labelPosition="right"
      content={t('buttons.next-article')}
      title={source.name}
    />
  );
};
export default PrevNextBtns;

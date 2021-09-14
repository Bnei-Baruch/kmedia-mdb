import React, { useContext, useEffect } from 'react';
import { withNamespaces } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';

import { CT_CLIPS, CT_LESSON_PART, CT_VIDEO_PROGRAM, CT_VIRTUAL_LESSONS, NO_NAME } from '../../../helpers/consts';
import { canonicalCollection } from '../../../helpers/utils';
import { DeviceInfoContext } from '../../../helpers/app-contexts';
import { canonicalLink } from '../../../helpers/links';
import { selectors, actions } from '../../../redux/modules/mdb';
import { selectors as settings } from '../../../redux/modules/settings';
import { selectors as recommended } from '../../../redux/modules/recommended';
import ListTemplate from './ListTemplate';
import CardTemplate from './CardTemplate';

const NOT_LESSONS_COLLECTIONS = [CT_VIDEO_PROGRAM, CT_VIRTUAL_LESSONS, CT_CLIPS];

const CUItemContainer = ({ id, children, t, asList = false, link, playTime }) => {
  const { isMobileDevice } = useContext(DeviceInfoContext);
  const unit               = useSelector(state => selectors.getDenormContentUnit(state.mdb, id));
  const language           = useSelector(state => settings.getLanguage(state.settings));
  const views              = useSelector(state => recommended.getViews(id, state.recommended));

  const dispatch = useDispatch();
  useEffect(() => {
    if (!unit) {
      dispatch(actions.fetchUnit(id));
    }
  }, [id]);

  if (!unit) return null;
  const ccu       = canonicalCollection(unit);
  const part      = Number(ccu?.ccuNames[unit.id]);
  let withCCUInfo = false;
  for (const i in unit.collections) {
    if (NOT_LESSONS_COLLECTIONS.includes(unit.collections[i].content_type))
      withCCUInfo = true;
  }

  const description = [];
  if (part && !isNaN(part)) description.push(t(`pages.unit.info.${unit.content_type === CT_LESSON_PART ? 'lesson-episode' : 'episode'}`, { name: part }));
  if (unit.film_date) description.push(t('values.date', { date: unit.film_date }));
  if (!isMobileDevice && views) description.push(t('pages.unit.info.views', { views }));

  const props = {
    unit,
    language,
    link: link || canonicalLink(unit),
    withCCUInfo,
    ccu,
    description,
    children,
    playTime
  };
  return (asList ? <ListTemplate {...props} /> : <CardTemplate {...props} />);
};

CUItemContainer.propTypes = {
  id: PropTypes.string.isRequired,
  link: PropTypes.string,
  asList: PropTypes.bool,
  playTime: PropTypes.number,
};

export default withNamespaces()(CUItemContainer);

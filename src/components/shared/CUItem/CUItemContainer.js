import React, { useContext, useEffect } from 'react';
import { withNamespaces } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';

import { selectors, actions } from '../../../redux/modules/mdb';
import { selectors as settings } from '../../../redux/modules/settings';
import { selectors as recommended } from '../../../redux/modules/recommended';
import {
  CT_CLIPS,
  CT_DAILY_LESSON,
  CT_LESSON_PART, CT_SPECIAL_LESSON,
  CT_VIDEO_PROGRAM,
  CT_VIRTUAL_LESSONS
} from '../../../helpers/consts';
import { canonicalCollection, cuPartNameByCCUType } from '../../../helpers/utils';
import { DeviceInfoContext } from '../../../helpers/app-contexts';
import { canonicalLink } from '../../../helpers/links';
import ListTemplate from './ListTemplate';
import CardTemplate from './CardTemplate';

const NOT_LESSONS_COLLECTIONS = [CT_VIDEO_PROGRAM, CT_VIRTUAL_LESSONS, CT_CLIPS];

const CUItemContainer = ({ id, children, t, asList = false, link, playTime, size, selected, ccuId, noViews }) => {
  const { isMobileDevice } = useContext(DeviceInfoContext);
  const unit               = useSelector(state => selectors.getDenormContentUnit(state.mdb, id));
  const language           = useSelector(state => settings.getLanguage(state.settings));
  const views              = useSelector(state => recommended.getViews(id, state.recommended));
  const ccu                = useSelector(state => selectors.getDenormCollection(state.mdb, ccuId)) || canonicalCollection(unit);

  const dispatch = useDispatch();
  useEffect(() => {
    if (!unit) {
      dispatch(actions.fetchUnit(id));
    }
  }, [id, unit, dispatch]);

  if (!unit) return null;
  const part      = Number(ccu?.ccuNames[unit.id]);
  let withCCUInfo = false;
  for (const i in unit.collections) {
    if (NOT_LESSONS_COLLECTIONS.includes(unit.collections[i].content_type))
      withCCUInfo = true;
  }

  const description = [];
  if (part && !isNaN(part)) description.push(t(cuPartNameByCCUType(ccu.content_type), { name: part }));
  if (unit.film_date) description.push(t('values.date', { date: unit.film_date }));
  if (!noViews && !(isMobileDevice && asList) && views > 0) description.push(t('pages.unit.info.views', { views }));

  const props = {
    unit,
    language,
    link: link || canonicalLink(unit),
    withCCUInfo,
    ccu,
    description,
    children,
    playTime,
    size: !isMobileDevice ? size : '',
    selected
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
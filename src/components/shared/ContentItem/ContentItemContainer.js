import React, { useContext, useEffect } from 'react';
import { withTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';

import { actions as mdbActions, selectors } from '../../../redux/modules/mdb';
import { selectors as recommended } from '../../../redux/modules/recommended';
import { selectors as sources } from '../../../redux/modules/sources';
import { selectors as tags } from '../../../redux/modules/tags';
import {
  CT_CLIPS,
  CT_CONGRESS,
  CT_DAILY_LESSON,
  CT_SOURCE,
  CT_SPECIAL_LESSON,
  CT_TAG,
  CT_VIDEO_PROGRAM,
  CT_VIRTUAL_LESSONS
} from '../../../helpers/consts';
import { canonicalCollection, cuPartNameByCCUType } from '../../../helpers/utils';
import { DeviceInfoContext } from '../../../helpers/app-contexts';
import { canonicalLink } from '../../../helpers/links';
import ListTemplate from './ListTemplate';
import CardTemplate from './CardTemplate';
import { stringify } from '../../../helpers/url';

const NOT_LESSONS_COLLECTIONS = [CT_VIDEO_PROGRAM, CT_VIRTUAL_LESSONS, CT_CLIPS];

const TagItemContainerHook = (
  {
    id,
    t,
    asList = false,
    link,
    size,
    selected,
    noViews,
    label = '',
    withInfo = undefined
  }
) => {
  const { isMobileDevice } = useContext(DeviceInfoContext);
  const tag                = useSelector(state => tags.getTagById(state.tags)(id));
  const views              = useSelector(state => recommended.getViews(id, state.recommended));

  if (!tag) return null;
  if (withInfo === undefined) {
    withInfo = true;
  }

  const description = [];
  if (!noViews && !(isMobileDevice && asList) && views > 0) description.push(t('pages.unit.info.views', { views }));

  const props = {
    tag,
    link       : link || canonicalLink({ id: tag.id, content_type: CT_TAG }),
    withCUInfo : false,
    withCCUInfo: withInfo,
    description,
    size       : !isMobileDevice ? size : '',
    selected,
    label
  };

  return (asList ? <ListTemplate {...props} /> : <CardTemplate {...props} />);
};

const SourceItemContainerHook = (
  {
    id,
    t,
    asList = false,
    link,
    size,
    selected,
    noViews,
    label = '',
    withInfo = undefined
  }
) => {
  const { isMobileDevice } = useContext(DeviceInfoContext);
  const source             = useSelector(state => sources.getSourceById(state.sources)(id));
  const views              = useSelector(state => recommended.getViews(id, state.recommended));

  if (!source) return null;
  if (withInfo === undefined) {
    withInfo = true;
  }

  const description = [];
  if (!noViews && !(isMobileDevice && asList) && views > 0) description.push(t('pages.unit.info.views', { views }));

  const props = {
    source,
    link       : link || canonicalLink({ id: source.id, content_type: CT_SOURCE }),
    withCUInfo : false,
    withCCUInfo: withInfo,
    description,
    size       : !isMobileDevice ? size : '',
    selected,
    label
  };

  return (asList ? <ListTemplate {...props} /> : <CardTemplate {...props} />);
};

const ContentItemContainer = (
  {
    id,
    children,
    t,
    asList = false,
    link,
    playTime,
    size,
    selected,
    ccuId,
    noViews,
    label = '',
    withCCUInfo = undefined,
    withCUInfo = undefined,
    name,
    lID,
    showImg
  }
) => {
  const { isMobileDevice } = useContext(DeviceInfoContext);
  const unit               = useSelector(state => selectors.getDenormContentUnit(state.mdb, id));
  const views              = useSelector(state => recommended.getViews(id, state.recommended));
  const ccu                = useSelector(state => selectors.getDenormCollection(state.mdb, ccuId)) || canonicalCollection(unit);
  const denormLabel        = useSelector(state => selectors.getDenormLabel(state.mdb));

  const dispatch = useDispatch();
  useEffect(() => {
    if (!unit) {
      dispatch(mdbActions.fetchUnit(id));
    }
  }, [id, unit, dispatch]);

  if (!unit) return null;
  if (withCUInfo === undefined) {
    withCUInfo = true;
  }

  if (withCCUInfo === undefined) {
    withCCUInfo = false;
    for (const i in unit.collections) {
      if (NOT_LESSONS_COLLECTIONS.includes(unit.collections[i].content_type))
        withCCUInfo = true;
    }
  }

  const description = [];
  if (withCCUInfo && ccu?.content_units?.length)
    description.push(t(`${cuPartNameByCCUType(ccu?.content_type)}s`, { name: ccu?.content_units.length }));

  const part     = Number(ccu?.ccuNames[unit.id]);
  const withPart = ccu && ![CT_DAILY_LESSON, CT_SPECIAL_LESSON, CT_CONGRESS].includes(ccu.content_type);

  if (withPart && part && !isNaN(part))
    description.push(t(cuPartNameByCCUType(ccu.content_type), { name: part }));

  if (unit.film_date)
    description.push(t('values.date', { date: unit.film_date }));

  if (!noViews && !(isMobileDevice && asList) && views > 0)
    description.push(t('pages.unit.info.views', { views }));

  link = link || canonicalLink(unit, null, ccu);
  if (lID) {
    const l = denormLabel(lID);
    name    = name || l?.name;
    link    = { ...link, search: stringify(l?.properties) };
  }

  const props = {
    unit,
    link,
    withCUInfo,
    withCCUInfo,
    ccu,
    description,
    children,
    playTime,
    size: !isMobileDevice ? size : '',
    selected,
    label,
    name,
    showImg
  };
  return (asList ? <ListTemplate {...props} /> : <CardTemplate {...props} />);
};

ContentItemContainer.propTypes = {
  id      : PropTypes.string.isRequired,
  link    : PropTypes.object,
  asList  : PropTypes.bool,
  playTime: PropTypes.number
};

SourceItemContainerHook.propTypes = {
  id    : PropTypes.string.isRequired,
  link  : PropTypes.object,
  asList: PropTypes.bool
};

export default withTranslation()(ContentItemContainer);
export const SourceItemContainer = withTranslation()(SourceItemContainerHook);
export const TagItemContainer    = withTranslation()(TagItemContainerHook);

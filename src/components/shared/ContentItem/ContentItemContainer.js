import React, { useContext, useEffect } from 'react';
import { withNamespaces } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';

import { selectors, actions } from '../../../redux/modules/mdb';
import { selectors as settings } from '../../../redux/modules/settings';
import { selectors as recommended } from '../../../redux/modules/recommended';
import { selectors as sources } from '../../../redux/modules/sources';
import {
  CT_CLIPS,
  CT_VIDEO_PROGRAM,
  CT_VIRTUAL_LESSONS,
  CT_SOURCE,
} from '../../../helpers/consts';
import { canonicalCollection, cuPartNameByCCUType } from '../../../helpers/utils';
import { DeviceInfoContext } from '../../../helpers/app-contexts';
import { canonicalLink } from '../../../helpers/links';
import ListTemplate from './ListTemplate';
import CardTemplate from './CardTemplate';

const NOT_LESSONS_COLLECTIONS = [CT_VIDEO_PROGRAM, CT_VIRTUAL_LESSONS, CT_CLIPS];

const SourceItemContainerHook = ({ id, t, asList = false, link, size, selected, noViews, label = '', withInfo = undefined }) => {
  const { isMobileDevice } = useContext(DeviceInfoContext);
  const source             = useSelector(state => sources.getSourceById(state.sources)(id));
  const language           = useSelector(state => settings.getLanguage(state.settings));
  const views              = useSelector(state => recommended.getViews(id, state.recommended));

  if (!source) return null;
  if (withInfo === undefined) {
    withInfo = true;
  }

  const description = [];
  if (!noViews && !(isMobileDevice && asList) && views > 0) description.push(t('pages.unit.info.views', { views }));

  const props = {
    source,
    language,
    link: link || canonicalLink({ id: source.id, content_type: CT_SOURCE }),
    withCUInfo: false,
    withCCUInfo: withInfo,
    ccu: source,
    description,
    size: !isMobileDevice ? size : '',
    selected,
    label,
  };
  return (asList ? <ListTemplate {...props} /> : <CardTemplate {...props} />);
}

const ContentItemContainer = ({ id, children, t, asList = false, link, playTime, size, selected, ccuId, noViews, label = '', withCCUInfo = undefined, withCUInfo = undefined, withPart = true }) => {
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
  if (withCCUInfo && ccu?.content_units?.length) description.push(t(`${cuPartNameByCCUType(ccu?.content_type)}s`, { name: ccu?.content_units.length }));
  const part = Number(ccu?.ccuNames[unit.id]);
  if (withPart && part && !isNaN(part)) description.push(t(cuPartNameByCCUType(ccu.content_type), { name: part }));
  if (unit.film_date) description.push(t('values.date', { date: unit.film_date }));
  if (!noViews && !(isMobileDevice && asList) && views > 0) description.push(t('pages.unit.info.views', { views }));

  const props = {
    unit,
    language,
    link: link || canonicalLink(unit),
    withCUInfo,
    withCCUInfo,
    ccu,
    description,
    children,
    playTime,
    size: !isMobileDevice ? size : '',
    selected,
    label,
  };
  return (asList ? <ListTemplate {...props} /> : <CardTemplate {...props} />);
};

ContentItemContainer.propTypes = {
  id: PropTypes.string.isRequired,
  link: PropTypes.string,
  asList: PropTypes.bool,
  playTime: PropTypes.number,
};

SourceItemContainerHook.propTypes = {
  id: PropTypes.string.isRequired,
  link: PropTypes.string,
  asList: PropTypes.bool,
};

export default withNamespaces()(ContentItemContainer);
export const SourceItemContainer = withNamespaces()(SourceItemContainerHook);
import React, { useContext } from 'react';
import {
  CT_CLIPS,
  CT_CONGRESS,
  CT_DAILY_LESSON,
  CT_SPECIAL_LESSON,
  CT_VIDEO_PROGRAM,
  CT_VIRTUAL_LESSONS,
} from '../../../src/helpers/consts';
import { canonicalCollection, cuPartNameByCCUType } from '../../../src/helpers/utils';
import { DeviceInfoContext } from '../../../src/helpers/app-contexts';
import { canonicalLink } from '../../../src/helpers/links';
import ListTemplate from './ListTemplate';
import CardTemplate from './CardTemplate';
import { useTranslation } from '../../i18n';

const NOT_LESSONS_COLLECTIONS = [CT_VIDEO_PROGRAM, CT_VIRTUAL_LESSONS, CT_CLIPS];

const ContentItem = async (
  {
    unit,
    lng,
    children,
    asList = false,
    link,
    playTime,
    size,
    selected,
    ccu,
    noViews,
    label = '',
    withCCUInfo = undefined,
    withCUInfo = undefined,
    name,
    mdbLabel,
    showImg
  }
) => {
  const { isMobileDevice } = false;//useContext(DeviceInfoContext);
  const { t }              = await useTranslation(lng);

  if (!unit) return null;

  //const views  = useSelector(state => recommended.getViews(id, state.recommended));
  ccu        = ccu || canonicalCollection(unit);
  withCUInfo = withCUInfo ?? true;
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

  let part;
  for (const key in unit.collections) {
    const [_ccuId, _part] = key.split('____');
    if (_ccuId === ccu.id) {
      part = _part;
      break;
    }
  }
  const withPart = ccu && ![CT_DAILY_LESSON, CT_SPECIAL_LESSON, CT_CONGRESS].includes(ccu.content_type);

  if (withPart && part && !isNaN(part))
    description.push(t(cuPartNameByCCUType(ccu.content_type), { name: part }));

  if (unit.film_date)
    description.push(t('values.date', { date: unit.film_date }));

  if (!noViews && !(isMobileDevice && asList) && views > 0)
    description.push(t('pages.unit.info.views', { views }));

  link = link || canonicalLink(unit, null, ccu);
  if (mdbLabel) {
    name = name || mdbLabel.name;
    link = { ...link, query: mdbLabel.properties };
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
export default ContentItem;

import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import duration from 'dayjs/plugin/duration';
import isBetween from 'dayjs/plugin/isBetween';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import localeData from 'dayjs/plugin/localeData';
import relativeTime from 'dayjs/plugin/relativeTime';

import 'dayjs/locale/cs';
import 'dayjs/locale/de';
import 'dayjs/locale/es';
import 'dayjs/locale/he';
import 'dayjs/locale/it';
import 'dayjs/locale/ru';
import 'dayjs/locale/tr';
import 'dayjs/locale/uk';

import { LANG_UKRAINIAN } from './consts';

dayjs.extend(utc);
dayjs.extend(localizedFormat);
dayjs.extend(duration);
dayjs.extend(isBetween);
dayjs.extend(isSameOrBefore);
dayjs.extend(customParseFormat);
dayjs.extend(localeData);
dayjs.extend(relativeTime);

// Site UI language codes mostly match dayjs locale codes; map the exceptions here.
export const setDayjsLocale = uiLang => dayjs.locale(uiLang === LANG_UKRAINIAN ? 'uk' : uiLang);

export default dayjs;

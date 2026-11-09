import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import dayjs from '../../../helpers/dayjs';

import { CT_DAILY_LESSON, getVideoRes } from '../../../helpers/consts';
import { isEmpty, physicalFile } from '../../../helpers/utils';
import { canonicalLink } from '../../../helpers/links';
import { absoluteUrl, bcp47, isoDuration, seoText, SITE_URL } from '../../../helpers/seo';
import { assetUrl, Requests } from '../../../helpers/Api';
import Basic from './Basic';
import Image from './Image';
import Video from './Video';
import JsonLd from './JsonLd';
import { useSelector } from 'react-redux';
import {
  settingsGetContentLanguagesSelector,
  mdbGetDenormContentUnitSelector,
  settingsGetUILangSelector
} from '../../../redux/selectors';

const byContentLanguage = contentLanguages => (a, b) => {
  const ia = contentLanguages.indexOf(a.language);
  const ib = contentLanguages.indexOf(b.language);
  return (ia === -1 ? Infinity : ia) - (ib === -1 ? Infinity : ib);
};

const buildSchema = ({ unit, description, uiLang, mediaFile, isVideo }) => {
  // pathname only: matches the self-referencing <link rel="canonical"> of /…/cu/:id
  const { pathname }         = canonicalLink(unit);
  const thumbnail            = assetUrl(`api/thumbnail/${unit.id}`);
  const duration             = mediaFile?.duration || unit.duration || Math.max(0, ...unit.files.map(f => f.duration || 0));

  return {
    '@type'     : isVideo ? 'VideoObject' : 'AudioObject',
    name        : unit.name,
    description : seoText(description || unit.name, 2000),
    url         : absoluteUrl(uiLang, pathname),
    thumbnailUrl: [
      Requests.imaginary('thumbnail', { url: thumbnail, width: 1200, height: 630, nocrop: true }),
      thumbnail,
    ],
    uploadDate  : unit.film_date ? dayjs.utc(unit.film_date).format() : undefined,
    duration    : isoDuration(duration),
    contentUrl  : mediaFile && !mediaFile.is_hls ? physicalFile(mediaFile, true) : undefined,
    encodingFormat: mediaFile?.mimetype,
    inLanguage  : mediaFile ? bcp47(mediaFile.language) : bcp47(uiLang),
    publisher   : { '@id': `${SITE_URL}#organization` },
    isPartOf    : Object.values(unit.collections || {}).filter(c => c.name && c.content_type !== CT_DAILY_LESSON).slice(0, 1).map(c => {
      const { pathname: cp, search: cs } = canonicalLink(c);
      return { '@type': 'CreativeWorkSeries', name: c.name, url: absoluteUrl(uiLang, cp, cs) };
    }),
  };
};

// Description of a unit page: own description → collection description →
// "<content type>, <date> — <collection name>" (most lessons have neither, and an empty
// description makes Google invent a snippet from the page chrome).
export const unitDescription = (unit, t) => {
  // a description that only repeats the title says nothing (some programs have description === name)
  const useful = d => !isEmpty(d) && d.trim() !== unit.name?.trim();
  if (useful(unit.description)) return unit.description;
  const collections = Object.values(unit.collections || {});
  const withDescription = collections.find(c => useful(c.description));
  if (withDescription) return withDescription.description;

  const type = unit.content_type ? t(`constants.content-types.${unit.content_type}`, { defaultValue: '' }) : '';
  const date = unit.film_date ? dayjs.utc(unit.film_date).format('LL') : '';
  const head = [type, date].filter(Boolean).join(', ');
  const coll = collections.find(c => c.name && c.name !== unit.name)?.name;
  return [head, coll].filter(Boolean).join(' — ');
};

const AVUnitWithDep = ({ unit, uiLang, contentLanguages }) => {
  const { t }       = useTranslation();
  const description = unitDescription(unit, t);

  const videoDate = dayjs.utc(unit.film_date).toDate();

  const videoFiles = unit.files
    .filter(file => (file.type === 'video' && contentLanguages.includes(file.language)))
    // Order files by content language.
    .sort(byContentLanguage(contentLanguages))
    .map(file => ({
      ...file,
      ...getVideoRes(file.video_size, videoDate),
      url: physicalFile(file, true)
    }));

  const sortByLang = byContentLanguage([uiLang, ...contentLanguages]);
  const video      = unit.files.filter(f => f.type === 'video').sort(sortByLang)[0];
  const audio      = unit.files.filter(f => f.type === 'audio').sort(sortByLang)[0];
  const mediaFile  = video || audio;

  return (
    <div>
      <Basic title={unit.name} description={description}/>
      <Image unitOrUrl={unit}/>
      {videoFiles.map(file => <Video key={file.id} releaseDate={unit.film_date} {...file} />)}
      {
        mediaFile && (
          <JsonLd id="unit" data={buildSchema({ unit, description, uiLang, mediaFile, isVideo: !!video })}/>
        )
      }
    </div>
  );
};

const areEqual = (prevProps, nextProps) =>
  ((!prevProps.unit && !nextProps.unit) || prevProps.unit.id === nextProps.unit.id)
  && prevProps.uiLang === nextProps.uiLang
  && prevProps.contentLanguages === nextProps.contentLanguages;

const AVUnitMemo = memo(AVUnitWithDep, areEqual);

const AVUnit = ({ id }) => {
  const unit             = useSelector(state => mdbGetDenormContentUnitSelector(state, id));
  const uiLang           = useSelector(settingsGetUILangSelector);
  const contentLanguages = useSelector(settingsGetContentLanguagesSelector);
  if (!unit || !unit.files) {
    return null;
  }

  return <AVUnitMemo unit={unit} uiLang={uiLang} contentLanguages={contentLanguages}/>;
};

export default AVUnit;

import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { actions as assetsActions } from '../../../redux/modules/assets';
import { getWipErr } from '../../shared/WipErr/WipErr';
import { cmsUrl, Requests } from '../../../helpers/Api';
import { publicFile } from '../../../helpers/utils';
import { settingsGetContentLanguagesSelector, assetsGetPersonSelector } from '../../../redux/selectors';
import Helmets from '../../shared/Helmets';

const stripTags = html => (html || '').replace(/<small[\s\S]*?<\/small>/gi, ' ').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();

// The CMS page is "<h1>name <small>(years)</small></h1> … <p>bio</p>": take the name and the bio for the head.
export const personHead = content => ({
  title      : stripTags(content?.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i)?.[1]),
  description: content?.split(/<\/h1>/i)[1] || '',
});

const convertImages = content => {
  const regex = /<img[^>]*src="([^"]*)"/g;
  let arr;
  while ((arr = regex.exec(content))) {
    const img = arr[1];
    if (!img.startsWith('http') && !img.startsWith('/static/')) {
      let imageFile = cmsUrl(img);
      if (!/^http/.exec(imageFile)) {
        imageFile = publicFile(imageFile);
      }

      const src = Requests.imaginary('resize', {
        url      : imageFile,
        width    : 160,
        height   : 200,
        nocrop   : false,
        stripmeta: true
      });

      content = content.replace(img, src);
    }
  }

  return content;
};

const LibraryPerson = () => {
  const { t } = useTranslation();
  const { id: sourceId }   = useParams();
  const contentLanguages   = useSelector(settingsGetContentLanguagesSelector);
  const { wip, err, data } = useSelector(assetsGetPersonSelector);
  const dispatch           = useDispatch();

  // The SSR already loaded this person: don't refetch on hydration (it would swap the content for a spinner).
  const skipFirstFetch = useRef(!!data?.slug?.startsWith(`${sourceId}-`));
  useEffect(() => {
    if (skipFirstFetch.current) {
      skipFirstFetch.current = false;
      return;
    }

    dispatch(assetsActions.fetchPerson({ sourceId, contentLanguages }));
  }, [sourceId, contentLanguages, dispatch]);

  const wipErr = getWipErr(wip, err);
  if (wipErr) {
    return wipErr;
  }

  if (!data) {
    return <div className="p-4">{t('materials.sources.no-source-available')}</div>;
  }

  const { title, description } = personHead(data.content);

  return (
    <div className="px-4 library-person">
      <Helmets.Basic title={title} description={description}/>
      <div>
        <div className="readable-width" dangerouslySetInnerHTML={{ __html: convertImages(data.content) }}/>
      </div>
    </div>
  );
};


export default LibraryPerson;

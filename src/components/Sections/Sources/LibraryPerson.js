import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { actions as assetsActions } from '../../../redux/modules/assets';
import { getWipErr } from '../../shared/WipErr/WipErr';
import { cmsUrl, Requests } from '../../../helpers/Api';
import { publicFile } from '../../../helpers/utils';
import { settingsGetContentLanguagesSelector, assetsGetPersonSelector } from '../../../redux/selectors';

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

  useEffect(() => {
    dispatch(assetsActions.fetchPerson({ sourceId, contentLanguages }));
  }, [sourceId, contentLanguages, dispatch]);

  const wipErr = getWipErr(wip, err);
  if (wipErr) {
    return wipErr;
  }

  if (!data) {
    return <div className="p-4">{t('materials.sources.no-source-available')}</div>;
  }

  return (
    <div className="px-4 library-person">
      <div>
        <div className="readble-width" dangerouslySetInnerHTML={{ __html: convertImages(data.content) }}/>
      </div>
    </div>
  );
};


export default LibraryPerson;

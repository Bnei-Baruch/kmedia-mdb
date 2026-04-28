import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { actions as assetsActions } from '../../../redux/modules/assets';
import { getWipErr } from '../../shared/WipErr/WipErr';
import { settingsGetContentLanguagesSelector, assetsGetAboutSelector } from '../../../redux/selectors';
import { usePrevious } from '../../../helpers/utils';

const AboutPage = () => {

  const contentLanguages   = useSelector(settingsGetContentLanguagesSelector);
  const { wip, err, data } = useSelector(assetsGetAboutSelector);

  const prevLangs = usePrevious(contentLanguages);
  const needFetch = !wip && !err && (!data || prevLangs?.length !== contentLanguages?.length);

  const dispatch = useDispatch();
  useEffect(() => {
    if (needFetch) {
      dispatch(assetsActions.fetchAbout({ contentLanguages }));
    }
  }, [contentLanguages, dispatch, needFetch]);

  const wipErr = getWipErr(wip || !data, err);
  if (wipErr) {
    return wipErr;
  }

  return (
    <div className=" px-4 ">
      <div className="flex flex-wrap">
        <div className="w-full">
          <div className="readble-width" dangerouslySetInnerHTML={{ __html: data.content }}/>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;

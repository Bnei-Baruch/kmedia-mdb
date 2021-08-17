import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';

import { actions, selectors } from '../../../redux/modules/likutim';
import { selectors as settings } from '../../../redux/modules/settings';
// import { actions as mdbActions, selectors as mdbSelectors } from '../../../redux/modules/mdb';
// import { MT_TEXT, CT_LIKUTIM } from '../../../helpers/consts';

const Main = () => {
  const wip = useSelector(state => selectors.getWip(state.likutim));
  const err = useSelector(state => selectors.getError(state.likutim));
  const likutim = useSelector(state => selectors.getLikutim(state.likutim), shallowEqual);
  const language = useSelector(state => settings.getContentLanguage(state.settings));

  const [dataLoaded, setDataLoaded] = useState(false);

  useEffect(() => {
    setDataLoaded(false);
  }, [language])

  const dispatch = useDispatch();

  useEffect(() => {
    if (!wip && !err && !dataLoaded) {
      console.log('fetch likutim:')
      dispatch(actions.fetchLikutim());
      setDataLoaded(true);
    }
  }, [dispatch, err, wip, dataLoaded])

  console.log('likutim:', language, likutim);

  return (
    <div>Likutim Page:
      {likutim.map(l =>
        <ul>
          {`${l.name} ${l.film_date}`}
        </ul>)}
    </div>
  )
}

export default Main;

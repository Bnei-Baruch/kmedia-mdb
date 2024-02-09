import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { actions as mdbActions } from '../../../../redux/modules/mdb';

import { MY_NAMESPACE_HISTORY } from '../../../../helpers/consts';
import { useNavigate, useLocation } from 'react-router-dom';
import { getSavedTime } from '../../../Player/helper';
import moment from 'moment';
import { getCuByCcuSkipPreparation, canonicalLink } from '../../../../helpers/links';
import { getEmbedFromQuery, EMBED_INDEX_BY_TYPE } from '../../../../helpers/player';
import {
  mdbGetDenormCollectionSelector,
  mdbGetErrorsSelector,
  mdbGetLastLessonIdSelector,
  myGetListSelector,
  settingsGetUILangSelector,
  mdbGetWipFn,
  mdbNestedGetDenormContentUnitSelector
} from '../../../../redux/selectors';

const BuildPlaylistLastDaily = () => {
  const lastLessonId    = useSelector(mdbGetLastLessonIdSelector);
  const wip             = useSelector(mdbGetWipFn).lastLesson;
  const err             = useSelector(mdbGetErrorsSelector).lastLesson;
  const ccu             = useSelector(state => mdbGetDenormCollectionSelector(state, lastLessonId)) || false;
  const denormCU        = useSelector(mdbNestedGetDenormContentUnitSelector);
  const historyItems    = useSelector(state => myGetListSelector(state, MY_NAMESPACE_HISTORY));
  const navigate        = useNavigate();
  const location        = useLocation();
  const uiLang          = useSelector(settingsGetUILangSelector);
  const { embed, type } = getEmbedFromQuery(location);
  const embedIdx        = EMBED_INDEX_BY_TYPE[type];

  const dispatch = useDispatch();

  useEffect(() => {
    if (!wip && !err && !lastLessonId) {
      dispatch(mdbActions.fetchLatestLesson());
    }
  }, [lastLessonId, wip, err, dispatch]);

  useEffect(() => {
    if (!ccu)
      return;

    const sorted = ccu.cuIDs.map(id => {
      const ht                          = historyItems.find(x => x.content_unit_uid === id);
      const { current_time: timestamp } = getSavedTime(id, ht);
      return { id, timestamp };
    }).filter(x => !!x.timestamp).sort((a, b) => {
      const mta = moment(a.timestamp);
      const mtb = moment(b.timestamp);
      return mta.isAfter(mtb) ? -1 : 1;
    });

    const cuId = sorted[0]?.id || getCuByCcuSkipPreparation(ccu);
    const to   = canonicalLink(denormCU(cuId), null, ccu);
    if (embed) to.search = `embed=${embedIdx}`;
    navigate({ ...to, pathname: `/${uiLang}${to.pathname}` }, { replace: true });
  }, [ccu, historyItems, navigate, embed, embedIdx]);

  return null;
};

export default BuildPlaylistLastDaily;

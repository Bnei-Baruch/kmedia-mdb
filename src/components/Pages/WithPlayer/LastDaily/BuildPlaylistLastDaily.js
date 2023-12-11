import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectors, actions } from '../../../../redux/modules/mdb';

import { selectors as my } from '../../../../redux/modules/my';
import { MY_NAMESPACE_HISTORY } from '../../../../helpers/consts';
import { useNavigate, useLocation } from 'react-router-dom';
import { selectors as settings } from '../../../../redux/modules/settings';
import { getSavedTime } from '../../../Player/helper';
import moment from 'moment';
import { getCuByCcuSkipPreparation, canonicalLink } from '../../../../helpers/links';
import { getEmbedFromQuery } from '../../../../helpers/player';

const BuildPlaylistLastDaily = () => {
  const lastLessonId    = useSelector(state => selectors.getLastLessonId(state.mdb));
  const wip             = useSelector(state => selectors.getWip(state.mdb).lastLesson);
  const err             = useSelector(state => selectors.getErrors(state.mdb).lastLesson);
  const ccu             = useSelector(state => selectors.getDenormCollection(state.mdb, lastLessonId)) || false;
  const denormCU        = useSelector(state => selectors.nestedGetDenormContentUnit(state.mdb));
  const historyItems    = useSelector(state => my.getList(state.my, MY_NAMESPACE_HISTORY));
  const navigate        = useNavigate();
  const location        = useLocation();
  const { embed, type } = getEmbedFromQuery(location);
  const uiLang          = useSelector(state => settings.getUILang(state.settings));

  const dispatch = useDispatch();

  useEffect(() => {
    if (!wip && !err && !lastLessonId) {
      dispatch(actions.fetchLatestLesson());
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
    if (embed) to.search = `embed=${type}`;
    navigate({ ...to, pathname: `/${uiLang}${to.pathname}` }, { replace: true });
  }, [ccu, historyItems, navigate, embed, type]);

  return null;
};

export default BuildPlaylistLastDaily;

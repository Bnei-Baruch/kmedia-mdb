import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectors, actions } from '../../../../redux/modules/mdb';
import moment from 'moment/moment';

import { selectors as my } from '../../../../redux/modules/my';
import { getCuByCcuSkipPreparation } from '../../../../helpers/links';
import { MY_NAMESPACE_HISTORY } from '../../../../helpers/consts';
import { getSavedTime } from '../../../Player/helper';
import WipErr from '../../../shared/WipErr/WipErr';
import BuildPlaylistByCollection from '../BuildPlaylistByCollection';
import { withNamespaces } from 'react-i18next';

const BuildPlaylistLastDaily = ({ t }) => {
  const lastLessonId = useSelector(state => selectors.getLastLessonId(state.mdb));
  const wip          = useSelector(state => selectors.getWip(state.mdb).lastLesson);
  const err          = useSelector(state => selectors.getErrors(state.mdb).lastLesson);
  const ccu          = useSelector(state => selectors.getDenormCollection(state.mdb, lastLessonId)) || false;
  const historyItems = useSelector(state => my.getList(state.my, MY_NAMESPACE_HISTORY));

  const dispatch = useDispatch();

  useEffect(() => {
    if (!wip && !err && !lastLessonId) {
      dispatch(actions.fetchLatestLesson());
    }
  }, [lastLessonId, wip, err, dispatch]);

  const wipErr = WipErr({ wip: wip || !ccu.cuIDs?.length, err, t });

  if (wipErr) {
    return wipErr;
  }
  const sorted = ccu.cuIDs.map(id => {
    const ht            = historyItems.find(x => x.content_unit_uid === id);
    const { timestamp } = getSavedTime(id, ht);
    return { id, timestamp };
  }).filter(x => !!x.timestamp).sort((a, b) => {
    const mta = moment(a.timestamp);
    const mtb = moment(b.timestamp);
    return mta.isAfter(mtb) ? -1 : 1;
  });

  const cuId = sorted[0]?.id || getCuByCcuSkipPreparation(ccu);

  return <BuildPlaylistByCollection cuId={cuId} id={ccu.id} />;
};

export default withNamespaces()(BuildPlaylistLastDaily);

import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import { withNamespaces } from 'react-i18next';

import { actions, selectors } from '../../redux/modules/mdb';
import { selectors as my } from '../../redux/modules/my';
import Helmets from '../shared/Helmets';
import WipErr from '../shared/WipErr/WipErr';
import { publicFile } from '../../helpers/utils';
import PlaylistContainer from './WithPlayer/Playlist/PlaylistContainer';
import { MY_NAMESPACE_HISTORY } from '../../helpers/consts';
import { isEqual } from 'lodash';
import { getSavedTime } from '../Player/helper';
import { getCuByCcuSkipPreparation } from '../../helpers/links';

const LastLessonCollection = ({ t }) => {
  const lastLessonId = useSelector(state => selectors.getLastLessonId(state.mdb));
  const wip          = useSelector(state => selectors.getWip(state.mdb).lastLesson);
  const err          = useSelector(state => selectors.getErrors(state.mdb).lastLesson);
  const ccu          = useSelector(state => selectors.getDenormCollection(state.mdb, lastLessonId), isEqual) || false;
  const ccuFetched   = useSelector(state => selectors.getFullCollectionFetched(state.mdb, lastLessonId)?.[lastLessonId], shallowEqual);
  const historyItems = useSelector(state => my.getList(state.my, MY_NAMESPACE_HISTORY));

  const dispatch = useDispatch();

  useEffect(() => {
    if (!wip && !err && !lastLessonId && !ccuFetched) {
      dispatch(actions.fetchLatestLesson());
    }
  }, [lastLessonId, ccuFetched, wip, err, dispatch]);

  const wipErr = WipErr({ wip: wip || !ccu.cuIDs?.length, err, t });

  if (wipErr) {
    return wipErr;
  }
  const lastLooked = ccu.cuIDs.map(id => {
    const ht        = historyItems.find(x => x.content_unit_uid === id);
    const timestamp = getSavedTime(id, ht);
    return { id, timestamp };
  }).sort((a, b) => b.timestamp - a.timestamp)[0];

  const cuId = lastLooked?.id || getCuByCcuSkipPreparation(ccu);
  return (
    <div>
      <Helmets.Basic title={t('lessons.last.title')} description={t('lessons.last.description')} />
      <Helmets.Image unitOrUrl={publicFile('seo/last_lesson.jpg')} />
      <PlaylistContainer cId={lastLessonId} cuId={cuId} />
    </div>
  );
};

LastLessonCollection.propTypes = {
  t: PropTypes.func.isRequired
};

export default withNamespaces()(LastLessonCollection);

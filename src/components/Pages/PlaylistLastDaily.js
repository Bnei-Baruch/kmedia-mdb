import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import { withNamespaces } from 'react-i18next';

import { actions, selectors } from '../../redux/modules/mdb';
import { actions as myActions, selectors as my } from '../../redux/modules/my';
import Helmets from '../shared/Helmets';
import WipErr from '../shared/WipErr/WipErr';
import { publicFile } from '../../helpers/utils';
import PlaylistContainer from './WithPlayer/Playlist/PlaylistContainer';
import { PAGE_NS_LESSONS } from '../../helpers/consts';
import { isEqual } from 'lodash';

const LastLessonCollection = ({ t }) => {
  const lastLessonId                        = useSelector(state => selectors.getLastLessonId(state.mdb));
  const wip                                 = useSelector(state => selectors.getWip(state.mdb).lastLesson);
  const err                                 = useSelector(state => selectors.getErrors(state.mdb).lastLesson);
  const { cuIDs: cu_uids }                  = useSelector(state => selectors.getDenormCollection(state.mdb, lastLessonId), isEqual);
  const ccuFetched                          = useSelector(state => selectors.getFullCollectionFetched(state.mdb, lastLessonId)?.[lastLessonId], shallowEqual);
  const lastLooked                          = useSelector(state => my.getList(state.my, PAGE_NS_LESSONS))?.[0];
  const { wip: myWip, err: myErr, fetched } = useSelector(state => my.getInfo(state.my, PAGE_NS_LESSONS));

  const dispatch = useDispatch();

  useEffect(() => {
    if (!wip && !err && !lastLessonId && !ccuFetched) {
      dispatch(actions.fetchLatestLesson());
    }
  }, [lastLessonId, ccuFetched, wip, err, dispatch]);

  useEffect(() => {
    if (cu_uids && !myWip && !fetched) {
      dispatch(myActions.fetch(PAGE_NS_LESSONS, { cu_uids, page_size: cu_uids.length }));
    }
  }, [dispatch, cu_uids, myWip, myErr]);

  const wipErr = WipErr({ wip: wip || !fetched, err: err && myErr, t });

  if (wipErr) {
    return wipErr;
  }

  const cuId = lastLooked || cu_uids.length > 1 ? cu_uids[1] : cu_uids[0];
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

import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import { withNamespaces } from 'react-i18next';

import { actions, selectors } from '../../../../redux/modules/mdb';
import Helmets from '../../../shared/Helmets';
import WipErr from '../../../shared/WipErr/WipErr';
import PlaylistCollectionContainer from '../../../Pages/PlaylistCollection/Container';
import { publicFile } from '../../../../helpers/utils';

const LastLessonCollection = ({ t }) => {
  const lastLessonId = useSelector(state => selectors.getLastLessonId(state.mdb));
  const wipMap = useSelector(state => selectors.getWip(state.mdb));
  const errorMap = useSelector(state => selectors.getErrors(state.mdb));

  const wip = wipMap.lastLesson;
  const err = errorMap.lastLesson;

  // console.log('lastLessonId:', lastLessonId, wip, err);

  const dispatch = useDispatch();

  useEffect(() => {
    if (!wip && !err && !lastLessonId) {
      dispatch(actions.fetchLatestLesson());
    }
  }, [dispatch, err, lastLessonId, wip]);

  const wipErr = WipErr({ wip, err, t });

  if (wipErr) {
    return wipErr;
  }

  if (!lastLessonId) {
    return null;
  }

  return (
    <div>
      <Helmets.Basic title={t('lessons.last.title')} description={t('lessons.last.description')} />
      <Helmets.Image unitOrUrl={publicFile('seo/last_lesson.jpg')} />

      <PlaylistCollectionContainer cId={lastLessonId} />
    </div>
  );
}

LastLessonCollection.propTypes = {
  t: PropTypes.func.isRequired
}

export default withNamespaces()(LastLessonCollection);

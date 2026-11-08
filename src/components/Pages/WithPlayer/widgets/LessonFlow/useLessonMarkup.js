import { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { actions } from '../../../../../redux/modules/assets';
import {
  assetsGetMarkupByIdSelector,
  mdbGetDenormContentUnitSelector,
  playlistGetInfoSelector
} from '../../../../../redux/selectors';
import { UNIT_LESSONS_TYPE } from '../../../../../helpers/consts';
import { getChapters } from './helper';

/**
 * Markup (chapters / paragraph timings) of the current content unit.
 * Fetched once per lesson unit; returns null while loading or when the lesson
 * has no markup (404 / error) — callers then render the page unchanged.
 */
const useLessonMarkup = () => {
  const { cuId } = useSelector(playlistGetInfoSelector);
  const unit     = useSelector(state => mdbGetDenormContentUnitSelector(state, cuId));
  const byId     = useSelector(assetsGetMarkupByIdSelector);
  const dispatch = useDispatch();

  const isLesson = UNIT_LESSONS_TYPE.includes(unit?.content_type);
  const entry    = cuId ? byId[cuId] : undefined;

  useEffect(() => {
    if (cuId && isLesson && !entry) dispatch(actions.fetchMarkup(cuId));
  }, [cuId, isLesson, entry, dispatch]);

  const data = isLesson ? entry?.data : null;
  return useMemo(() => {
    const chapters = getChapters(data);
    if (!data || chapters.length === 0) return null;
    return { ...data, chapters };
  }, [data]);
};

export default useLessonMarkup;

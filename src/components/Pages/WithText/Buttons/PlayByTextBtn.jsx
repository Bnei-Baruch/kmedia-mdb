import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { actions, selectors as assets } from '../../../../redux/modules/assets';
import { seek, setPip } from '../../../../pkg/jwpAdapter/adapter';
import {
  textPageGetSubjectSelector,
  textPageGetFileSelector,
  textPageGetWordOffsetSelector,
  textPageGetUrlInfoSelector
} from '../../../../redux/selectors';
import ToolbarBtnTooltip from './ToolbarBtnTooltip';
import { PlayByText } from '../../../../images/icons';


const recursiveFindPrevTimeByPos = (pos, timeCode) => {
  if (pos === 0 || Object.keys(timeCode).length === 0) return 0;
  if (timeCode[pos]) return timeCode[pos];
  return recursiveFindPrevTimeByPos(pos - 1, timeCode);
};

const PlayByTextBtn = () => {
  const { id } = useSelector(textPageGetSubjectSelector);
  const { language } = useSelector(textPageGetFileSelector);
  const wordOffset = useSelector(textPageGetWordOffsetSelector);
  const timeCode = useSelector(state => assets.getTimeCode(state.assets));
  const hasTimeCode = Object.keys(timeCode).length > 0;
  const hasNoSel = !useSelector(textPageGetUrlInfoSelector).select;

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(actions.fetchTimeCode(id, language));
  }, [id, language, dispatch]);

  if (!hasTimeCode) return null;

  const handlePlay = () => {
    const startTime = recursiveFindPrevTimeByPos(wordOffset - 2, timeCode);
    seek(startTime).play();
    setPip(true);
  };

  return (
    <ToolbarBtnTooltip
      textKey="play-by-text"
      className="text_mark_on_select_btn no_stroke"
      disabled={hasNoSel}
      onClick={handlePlay}
      icon={<PlayByText />}
    />
  );
};

export default PlayByTextBtn;

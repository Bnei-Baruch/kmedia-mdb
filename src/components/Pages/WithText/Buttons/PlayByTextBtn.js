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

const PlayByTextBtn = () => {
  const { id }        = useSelector(textPageGetSubjectSelector);
  const { language }  = useSelector(textPageGetFileSelector);
  const wordOffset    = useSelector(textPageGetWordOffsetSelector);
  const hasTimeCode   = useSelector(state => assets.hasTimeCode(state.assets));
  const timeCodeByPos = useSelector(state => assets.getTimeCode(state.assets));
  const hasNoSel      = !useSelector(textPageGetUrlInfoSelector).select;

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(actions.fetchTimeCode(id, language));
  }, [id, language, dispatch]);

  if (!hasTimeCode) return null;

  const handlePlay = () => {
    const startTime = timeCodeByPos(wordOffset - 2);
    seek(startTime).play();
    setPip(true);
  };

  return (
    <ToolbarBtnTooltip
      textKey="play-by-text"
      className="text_mark_on_select_btn"
      disabled={hasNoSel}
      onClick={handlePlay}
      icon={<span className="material-symbols-outlined">play_arrow</span>}
    />
  );
};

export default PlayByTextBtn;

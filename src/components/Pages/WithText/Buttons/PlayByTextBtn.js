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
    const startTime = timeCodeByPos(wordOffset);
    seek(startTime).play();
    setPip(true);
  };

  return (
    <ToolbarBtnTooltip
      textKey="play-by-text"
      className="text_mark_on_select_btn no_stroke"
      disabled={hasNoSel}
      onClick={handlePlay}
      icon={<PlayByText/>}
    />
  );
};

export default PlayByTextBtn;

import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { actions } from '../../../../redux/modules/assets';
import { seek, setPip } from '../../../../pkg/jwpAdapter/adapter';
import {
  textPageGetSubjectSelector,
  textPageGetFileSelector,
  textPageGetWordOffsetSelector,
  textPageGetUrlSelectSelector,
  assetsHasTimeCodeSelector,
  assetsGetTimeCodeSelector
} from '../../../../redux/selectors';
import ToolbarBtnTooltip from './ToolbarBtnTooltip';
import { PlayByText } from '../../../../images/icons';

const PlayByTextBtn = () => {
  const { id }        = useSelector(textPageGetSubjectSelector);
  const { language }  = useSelector(textPageGetFileSelector);
  const wordOffset    = useSelector(textPageGetWordOffsetSelector);
  const hasTimeCode   = useSelector(assetsHasTimeCodeSelector);
  const timeCodeByPos = useSelector(assetsGetTimeCodeSelector);
  const hasNoSel      = !useSelector(textPageGetUrlSelectSelector);

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
      className="text_mark_on_select_btn no_stroke"
      disabled={hasNoSel}
      onClick={handlePlay}
      icon={<PlayByText />}
    />
  );
};

export default PlayByTextBtn;

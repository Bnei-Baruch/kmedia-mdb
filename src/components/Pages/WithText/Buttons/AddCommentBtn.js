import React from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { actions, NOTE_STATUS } from '../../../../redux/modules/myNotes';
import { addHighlightByRanges } from '../helper';
import {
  textPageGetSubjectSelector,
  textPageGetFileSelector,
  textPageGetUrlInfoSelector,
  myNotesGetStatusSelector
} from '../../../../redux/selectors';
import ToolbarBtnTooltip from './ToolbarBtnTooltip';

const AddCommentBtn = () => {
  const { select, search }  = useSelector(textPageGetUrlInfoSelector);
  const { id: subject_uid } = useSelector(textPageGetSubjectSelector);
  const { language }        = useSelector(textPageGetFileSelector);
  const status              = useSelector(myNotesGetStatusSelector);

  const properties = { ...select, ...search };
  const dispatch   = useDispatch();

  const handleOpen = () => {
    const note = {
      content: '',
      subject_uid,
      language,
      properties,
    };

    dispatch(actions.setStatus(NOTE_STATUS.edit));
    dispatch(actions.setSelected(note));
    const _sel = window.getSelection();
    if (!_sel.isCollapsed) {
      addHighlightByRanges([window.getSelection().getRangeAt(0)]);
      window.getSelection().removeAllRanges();
    }
  };

  return (
    <ToolbarBtnTooltip
      textKey="add-comment"
      className="text_mark_on_select_btn"
      onClick={handleOpen}
      active={status !== NOTE_STATUS.none}
      icon={<span className="material-symbols-outlined">add_comment</span>}
    />
  );
};

export default AddCommentBtn;

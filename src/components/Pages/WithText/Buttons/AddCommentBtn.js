import React from 'react';
import { Button } from 'semantic-ui-react';
import { useSelector, useDispatch } from 'react-redux';

import { actions, NOTE_STATUS } from '../../../../redux/modules/myNotes';
import { addHighlightByRanges } from '../helper';
import {
  textPageGetSubjectSelector,
  textPageGetFileSelector,
  textPageGetUrlInfoSelector
} from '../../../../redux/selectors';
import ToolbarBtnTooltip from './ToolbarBtnTooltip';

const AddCommentBtn = () => {
  const { select, search }  = useSelector(textPageGetUrlInfoSelector);
  const { id: subject_uid } = useSelector(textPageGetSubjectSelector);
  const { language }        = useSelector(textPageGetFileSelector);

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
      trigger={
        <Button
          onClick={handleOpen}
          icon={<span className="material-symbols-outlined">add_comment</span>}
        />
      }
    />
  );
};

export default AddCommentBtn;

import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Popup } from 'semantic-ui-react';
import { useSelector, useDispatch } from 'react-redux';

import { actions, NOTE_STATUS } from '../../../../redux/modules/myNotes';
import { addHighlightByRanges } from '../helper';
import {
  textPageGetSubjectSelector,
  textPageGetFileSelector,
  textPageGetUrlInfoSelector,
  settingsGetUIDirSelector
} from '../../../../redux/selectors';

const AddNoteBtn = () => {
  const { t }               = useTranslation();
  const uiDir               = useSelector(settingsGetUIDirSelector);
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
    <Popup
      content={t('messages.add-new-note')}
      dir={uiDir}
      trigger={
        <Button
          onClick={handleOpen}
          icon={
            <span className="material-symbols-outlined">
                add_comment
            </span>
          }
        />
      }
    />
  );
};

export default AddNoteBtn;

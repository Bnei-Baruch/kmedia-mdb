import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Popup } from 'semantic-ui-react';
import { useSelector, useDispatch, batch } from 'react-redux';

import { actions, NOTE_STATUS } from '../../../../redux/modules/myNotes';
import { addHighlightByRanges } from '../helper';
import {
  textPageGetSubjectSelector,
  textPageGetFileSelector,
  textPageGetUrlInfoSelector,
  settingsGetUIDirSelector
} from '../../../../redux/selectors';

const AddNoteBtn = () => {
  const { t }                  = useTranslation();
  const uiDir                  = useSelector(settingsGetUIDirSelector);
  const { select: properties } = useSelector(textPageGetUrlInfoSelector);
  const { id: subject_uid }    = useSelector(textPageGetSubjectSelector);
  const { language }           = useSelector(textPageGetFileSelector);

  const dispatch = useDispatch();

  const handleOpen = () => {
    const note = {
      content: '',
      subject_uid,
      language,
      properties,
    };
    batch(() => {
      dispatch(actions.setStatus(NOTE_STATUS.edit));
      dispatch(actions.setSelected(note));

      addHighlightByRanges([window.getSelection().getRangeAt(0)]);
      window.getSelection().removeAllRanges();
    });
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

import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Popup } from 'semantic-ui-react';
import { useSelector, useDispatch, batch } from 'react-redux';
import { selectors as settings } from '../../../../redux/modules/settings';
import { selectors as textPage } from '../../../../redux/modules/textPage';
import { actions, NOTE_STATUS } from '../../../../redux/modules/myNotes';

const AddNoteBtn = () => {
  const { t }                  = useTranslation();
  const uiDir                  = useSelector(state => settings.getUIDir(state.settings));
  const { select: properties } = useSelector(state => textPage.getUrlInfo(state.textPage));
  const { id: subject_uid }    = useSelector(state => textPage.getSubject(state.textPage));
  const { language }           = useSelector(state => textPage.getFile(state.textPage));

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

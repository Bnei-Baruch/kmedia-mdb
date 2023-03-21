import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { Button, Popup } from 'semantic-ui-react';
import { getLanguageDirection } from '../../../helpers/i18n-utils';
import { textMarksPrefixByType } from '../../../helpers/scrollToSearch/helper';
import NoteModal from '../NoteModal';
import moment from 'moment/moment';

const idPrefix = textMarksPrefixByType.note;
const NoteMark = ({ note, offset }) => {
  const [top, setTop]       = useState(0);
  const [bottom, setBottom] = useState(0);
  const [open, setOpen]     = useState(false);

  const { t } = useTranslation();

  const handleOpen = () => {
    setOpen(true);
  };

  const handleToggleOpen = (o) => {
    setOpen(o);
  };

  const { language, content, id } = note;

  useEffect(() => {
    let start = document.getElementById(`${idPrefix.start}${id}`);
    let end   = document.getElementById(`${idPrefix.end}${id}`);
    start     = start || end || null;
    end       = end || start || null;
    if (start) {
      const b = start.offsetTop !== end.offsetTop ? end.offsetTop : end.offsetTop + 20;
      setTop(Math.min(start.offsetTop, b));
      setBottom(Math.max(start.offsetTop, b));
    }
  }, [id]);

  if (!top || !bottom)
    return null;

  const dir = getLanguageDirection(language);

  return (
    <div className="note_mark" style={{ top, height: bottom - top + 20, left: `${offset.x * 8}px` }}>
      <NoteModal note={note} open={open} toggleOpen={handleToggleOpen} />
      <Popup
        trigger={
          <div>
            <Button
              basic
              className="clear_button"
              icon="comment outline"
              color="orange"
            />
          </div>
        }
        inverted
        on="hover"
        hoverable
        className="label_mark_popup"
        dir={dir}
      >
        <Popup.Content>
          <div>{moment.utc(note.created_at).format('YYYY-MM-DD')}</div>
          {content}
        </Popup.Content>
        <Popup.Content>
          <Button
            onClick={handleOpen}
            content={t('buttons.edit')}
            className="clear_button margin-top-8"
          />
        </Popup.Content>
      </Popup>
    </div>

  );
};

NoteMark.propTypes = {
  note: PropTypes.object,
};

export default NoteMark;

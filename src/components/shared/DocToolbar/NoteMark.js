import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { Button, Popup } from 'semantic-ui-react';
import { getLanguageDirection } from '../../../helpers/i18n-utils';
import { textMarksPrefixByType } from '../../../helpers/scrollToSearch/helper';
import NoteModal from '../NoteModal';
import moment from 'moment/moment';

const idPrefix               = textMarksPrefixByType.note;
const TOOLTIP_LETTERS_LENGTH = 20;
const NoteMark               = ({ note, offset }) => {
  const [pos, setPos]                 = useState(0);
  const [open, setOpen]               = useState(false);
  const [openTooltip, setOpenTooltip] = useState(false);

  const { t } = useTranslation();

  const handleOpen = () => {
    setOpen(true);
    setOpenTooltip(false);
  };

  const handleToggleOpen   = (o) => setOpen(o);
  const handleOpenTooltip  = () => setOpenTooltip(true);
  const handleCloseTooltip = () => setOpenTooltip(false);

  const { language, id } = note;
  const content          = note.content?.substring(0, TOOLTIP_LETTERS_LENGTH);

  useEffect(() => {
    const findElPos = () => {
      let start = document.getElementById(`${idPrefix.start}${id}`);
      let end   = document.getElementById(`${idPrefix.end}${id}`);
      start     = start || end || null;
      end       = end || start || null;
      if (start) {
        const _pos = start.offsetTop + (end.offsetTop - start.offsetTop - 20) / 2;
        setPos(_pos);
      }
    };
    //need to wait till parent DOM will render for find element
    setTimeout(findElPos, 0);
  }, [id]);

  if (!pos)
    return null;

  const dir = getLanguageDirection(language);

  return (
    <div className="note_mark" style={{ top: `${pos}px`, left: `${offset.x * 8}px` }}>
      {open && <NoteModal note={note} toggleOpen={handleToggleOpen} />}
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
        open={openTooltip}
        onOpen={handleOpenTooltip}
        onClose={handleCloseTooltip}
        inverted
        on="hover"
        hoverable
        className="label_mark_popup"
        dir={dir}
      >
        <Popup.Content>
          <div>{moment.utc(note.created_at).format('YYYY-MM-DD')}</div>
          {`${content}...`}
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

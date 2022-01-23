import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Icon, Label, Popup } from 'semantic-ui-react';
import { useDispatch } from 'react-redux';
import { withNamespaces } from 'react-i18next';
import { actions } from '../../../redux/modules/trim';
import { MDBFile } from '../../shapes';

const TrimBtn = ({ file, sstart, send, width, t }) => {
  const [open, setOpen] = useState(false);

  const dispatch  = useDispatch();
  const handleCut = () => {
    if (sstart === send) return;

    dispatch(actions.trim({ sstart, send, uid: file.id }));
  };

  return (
    <Popup
      open={open}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      content={t('player.download.iconHoverText')}
      position={'top right'}
      trigger={
        <Button
          circular
          onClick={handleCut}
          compact
          style={{ width: `${width}px`, height: `${width}px` }}
          size="big"
          className="cut_and_download_btn"
        >
          <Label
            color="red"
            floating
            content={t('messages.new')}
          />
          <Icon name="cloud download" />
        </Button>
      }
    />
  );
};

TrimBtn.propTypes = {
  file: MDBFile,
  sstart: PropTypes.string,
  send: PropTypes.string,
  width: PropTypes.number
};

export default withNamespaces()(TrimBtn);

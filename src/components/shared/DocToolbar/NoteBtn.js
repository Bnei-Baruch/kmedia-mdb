import React, {useRef} from 'react';
import PropTypes from 'prop-types';
import {withNamespaces} from 'react-i18next';
import {Button, MenuItem, Popup} from 'semantic-ui-react';

const NoteBtn = ({t, url}) => (
  <Popup
    content={t('share-text.note-button-alt')}
    trigger={
      <MenuItem>
        <Button circular icon="sticky note"/>
        {t('share-text.note-button')}
      </MenuItem>
    }
  />
);

NoteBtn.propTypes = {
  t: PropTypes.func.isRequired,
  url: PropTypes.string.isRequired,
};

export default withNamespaces()(NoteBtn);

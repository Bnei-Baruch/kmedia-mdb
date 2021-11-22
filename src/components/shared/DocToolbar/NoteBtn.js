import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import { withNamespaces } from 'react-i18next';
import { Button, MenuItem } from 'semantic-ui-react';

const NoteBtn = ({ t, url }) => {

  return (
    <MenuItem>
      <Button circular icon="sticky note" />
      note
    </MenuItem>
  );
};

NoteBtn.propTypes = {
  t: PropTypes.func.isRequired,
  url: PropTypes.string.isRequired,
};

export default withNamespaces()(NoteBtn);

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { withNamespaces } from 'react-i18next';
import { Button, Popup, } from 'semantic-ui-react';

import { SectionLogo } from '../../../helpers/images';
import SelectTopicsModal from './SelectTopicsModal';

const LabelButton = ({ t, source }) => {
  const [open, setOpen] = useState();

  const handleOpen  = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return !source ? null : (
    <SelectTopicsModal
      source={source}
      open={open}
      onClose={handleClose}
      trigger={
        <Popup
          content={t('share-text.tag-button-alt')}
          trigger={
            <Button
              compact
              size="small"
              icon={<SectionLogo name="topics" color="grey" />}
              onClick={handleOpen}
              className="label_icon"
            />
          }
        />
      }
    />
  );
};

LabelButton.propTypes = {
  t: PropTypes.func.isRequired,
  source: PropTypes.object.isRequired,
};

export default withNamespaces()(LabelButton);

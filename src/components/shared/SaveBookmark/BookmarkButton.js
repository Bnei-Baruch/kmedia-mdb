import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { withNamespaces } from 'react-i18next';
import { Button, Modal, } from 'semantic-ui-react';

import NeedToLogin from '../../Sections/Personal/NeedToLogin';
import { getLanguageDirection } from '../../../helpers/i18n-utils';
import BookmarkForm from './BookmarkForm';

const BookmarkButton = ({ t, language, source }) => {
  const [open, setOpen] = useState();
  const needToLogin     = NeedToLogin({ t });

  const dir = getLanguageDirection(language);

  const handleOpen  = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <Modal
      trigger={
        <Button
          icon="bookmark outline"
          onClick={handleOpen}
        />
      }
      open={open}
      onClose={handleClose}
      size="tiny"
      dir={dir}
    >
      <Modal.Header content={t('personal.saveBookmark')} />
      {
        !needToLogin ? <BookmarkForm onClose={handleClose} source={source} /> : <Modal.Content content={needToLogin} />
      }
    </Modal>
  );
};

BookmarkButton.propTypes = {
  t: PropTypes.func.isRequired,
  source: PropTypes.object.isRequired,
};

export default withNamespaces()(BookmarkButton);

import React from 'react';
import PropTypes from 'prop-types';
import CopyToClipboard from 'react-copy-to-clipboard';
import { Button, MenuItem, Popup, } from 'semantic-ui-react';

import useStateWithCallback from '../../../helpers/use-state-with-callback';
import { withNamespaces } from 'react-i18next';

const POPOVER_CONFIRMATION_TIMEOUT = 2500;

const CopyBtn = ({ t, name, text, popup, icon }) => {
  const [open, setOpen] = useStateWithCallback(false, open => {
    if (open) {
      timeout = setTimeout(() => setOpen(false), POPOVER_CONFIRMATION_TIMEOUT);
    }
  });

  let timeout = undefined;

  const handleCopied = () => {
    clearPopupTimeout();
    setOpen(true);
  };

  const clearPopupTimeout = () => {
    if (timeout) {
      clearTimeout(timeout);
      timeout = null;
    }
  };

  return (
    <Popup // link was copied message popup
      open={open}
      content={popup}
      position={`bottom left`}
      trigger={
        (
          <Popup
            content={t('share-text.copy-button-alt')}
            trigger={
              <CopyToClipboard
                text={text}
                onCopy={handleCopied}
              >
                <MenuItem>
                  <Button circular icon={icon}/>
                  {name}
                </MenuItem>
              </CopyToClipboard>
            }
          />
        )
      }
    />
  );
};

CopyBtn.propTypes = {
  name: PropTypes.string.isRequired,
  popup: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  icon: PropTypes.string.isRequired,
};

export default withNamespaces()(CopyBtn);

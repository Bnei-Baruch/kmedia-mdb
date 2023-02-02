import { Input, Button, Popup } from 'semantic-ui-react';
import React, { useState } from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';
import useShareUrl from '../hooks/useShareUrl';
import { useSelector } from 'react-redux';
import { selectors as settings } from '../../../redux/modules/settings';
import { getLanguageDirection } from '../../../helpers/i18n-utils';
import { withNamespaces } from 'react-i18next';
import { POPOVER_CONFIRMATION_TIMEOUT } from './helper';

let timeout;
const CopyShareUrl = ({ t }) => {
  const [open, setOpen] = useState();

  const language = useSelector(state => settings.getLanguage(state.settings));
  const dir      = getLanguageDirection(language);

  const handleCopied = () => {
    clearTimeout(timeout);
    setOpen(true);
    timeout = setTimeout(() => setOpen(false), POPOVER_CONFIRMATION_TIMEOUT);
  };
  const shareUrl     = useShareUrl();

  return (
    <Input
      size="mini"
      fluid
      value={shareUrl}
      action
      dir={dir}
      readOnly
    >
      <input dir="ltr" />
      <Popup
        open={open}
        content={t('messages.link-copied-to-clipboard')}
        position="bottom right"
        trigger={(
          <CopyToClipboard text={shareUrl} onCopy={handleCopied}>
            <Button
              content={t('buttons.copy')}
              size="small"
              compact
            />
          </CopyToClipboard>
        )}
      />
    </Input>
  );
};

export default withNamespaces()(CopyShareUrl);

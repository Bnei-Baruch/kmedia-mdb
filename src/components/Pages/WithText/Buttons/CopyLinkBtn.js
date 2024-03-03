import { Popup } from 'semantic-ui-react';
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import CopyToClipboard from 'react-copy-to-clipboard';
import ToolbarBtnTooltip from './ToolbarBtnTooltip';
import { POPOVER_CONFIRMATION_TIMEOUT } from '../../../Player/Sharing/helper';
import { useSelector } from 'react-redux';
import { textPageGetUrlInfoSelector, textPageGetFileSelector } from '../../../../redux/selectors';

let timeout;
const CopyLinkBtn = () => {
  const { t } = useTranslation();

  const { select, search, url } = useSelector(textPageGetUrlInfoSelector);
  const noFile                  = !useSelector(textPageGetFileSelector);

  const [urlWithParams, setUrlWithParams] = useState(url);
  const [open, setOpen]                   = useState(false);

  useEffect(() => {
    if (!url) return;

    const _url = new URL(url);

    const properties = { ...select, ...search };
    for (const key in properties) {
      _url.searchParams.set(key, properties[key]);
    }

    setUrlWithParams(_url.toString());
  }, [select, search, url]);

  const handleCopied = () => {
    clearTimeout(timeout);
    setOpen(true);
    timeout = setTimeout(() => setOpen(false), POPOVER_CONFIRMATION_TIMEOUT);
  };

  return (
    <Popup
      open={open}
      content={t('messages.link-copied-to-clipboard')}
      position="bottom right"
      trigger={(
        <CopyToClipboard text={urlWithParams} onCopy={handleCopied}>
          <ToolbarBtnTooltip
            textKey="copy-link"
            className="text_mark_on_select_btn"
            disabled={noFile}
            icon={<span className="material-symbols-outlined">link</span>}
          />
        </CopyToClipboard>
      )}
    />
  );
};

export default CopyLinkBtn;


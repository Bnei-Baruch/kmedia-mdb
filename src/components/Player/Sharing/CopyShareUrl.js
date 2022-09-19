import { Input, Button } from 'semantic-ui-react';
import React from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';
import useShareUrl from '../hooks/StartEnd';

const CopyShareUrl = () => {
  const shareUrl = useShareUrl();

  return (
    <Input
      size="mini"
      fluid
      value={shareUrl}
      action
    >
      <input />
      <CopyToClipboard text={shareUrl}>
        <Button
          content="copy"
          size="small"
          compact
        />
      </CopyToClipboard>
    </Input>
  );
};

export default CopyShareUrl;

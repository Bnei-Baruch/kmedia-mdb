import { Input, Button } from 'semantic-ui-react';
import React from 'react';
import { useSelector } from 'react-redux';
import { selectors } from '../../../redux/modules/player';
import CopyToClipboard from 'react-copy-to-clipboard';

const CopyShareUrl = () => {
  const shareUrl = useSelector(state => selectors.getShareUrl(state.player));

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

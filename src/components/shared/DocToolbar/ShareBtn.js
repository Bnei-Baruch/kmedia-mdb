import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { withNamespaces } from 'react-i18next';
import { Button, Dropdown, MenuItem, Popup } from 'semantic-ui-react';

import {
  EmailIcon,
  EmailShareButton,
  FacebookIcon,
  FacebookShareButton, MailruIcon, MailruShareButton, TelegramIcon, TelegramShareButton,
  TwitterIcon,
  TwitterShareButton,
  WhatsappIcon,
  WhatsappShareButton
} from 'react-share';

const ShareBtn = ({ t, url }) => {
  const [open, setOpen] = useState(false);

  const handleOnOpen = () => setOpen(true);
  const handleOnClose = () => setOpen(false);

  const renderButtons = () => {
    const bsPixels = 28;
    const title = t('share-text.message-title');

    return (
      <Dropdown.Menu>
        <Dropdown.Item>
          <FacebookShareButton url={url} quote={title} className="margin-right-4">
            <FacebookIcon size={bsPixels} round/>
          </FacebookShareButton>
        </Dropdown.Item>
        <Dropdown.Item>
          <TwitterShareButton url={url} title={title} className="margin-right-4">
            <TwitterIcon size={bsPixels} round/>
          </TwitterShareButton>
        </Dropdown.Item>
        <Dropdown.Item>
          <WhatsappShareButton url={url} title={title} separator=": " className="margin-right-4">
            <WhatsappIcon size={bsPixels} round/>
          </WhatsappShareButton>
        </Dropdown.Item>
        <Dropdown.Item>
          <TelegramShareButton url={url} title={title} className="margin-right-4">
            <TelegramIcon size={bsPixels} round/>
          </TelegramShareButton>
        </Dropdown.Item>
        <Dropdown.Item>
          <MailruShareButton url={url} title={title} className="margin-right-4">
            <MailruIcon size={bsPixels} round/>
          </MailruShareButton>
        </Dropdown.Item>
        <Dropdown.Item>
          <EmailShareButton url={url} subject={title} body={url} className="margin-right-8">
            <EmailIcon size={bsPixels} round/>
          </EmailShareButton>
        </Dropdown.Item>
      </Dropdown.Menu>
    );
  };

  return (
    <Dropdown
      icon={null}
      selectOnBlur={false}
      open={open}
      onOpen={handleOnOpen}
      onClose={handleOnClose}
      onChange={handleOnClose}
      pointing={'bottom left'}
      trigger={
        (
          <Popup
            content={t('share-text.share-button-alt')}
            trigger={
              <MenuItem>
                <Button circular icon="share alternate"/>
                {t('share-text.share-button')}
              </MenuItem>
            }
          />
        )
      }
    >
      {renderButtons()}
    </Dropdown>
  );
};

ShareBtn.propTypes = {
  t: PropTypes.func.isRequired,
  url: PropTypes.string.isRequired,
};

export default withNamespaces()(ShareBtn);

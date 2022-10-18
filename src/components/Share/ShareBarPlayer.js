import React from 'react';
import { withNamespaces } from 'react-i18next';
import {
  EmailIcon,
  EmailShareButton,
  FacebookIcon,
  FacebookShareButton,
  MailruIcon,
  MailruShareButton,
  TelegramIcon,
  TelegramShareButton,
  TwitterIcon,
  TwitterShareButton,
  WhatsappIcon,
  WhatsappShareButton,
} from 'react-share';

import CutAndDownload from './TrimBtn';
import EmbeddedShareButton from './EmbeddedShareButton';

const bsPixelsBySize = {
  tiny: 26,
  small: 36,
  big: 46,
};

const ShareBarPlayer = ({ url, t, }) => {

  const bsPixels = bsPixelsBySize.big;
  const title    = t('player.share.title');

  return (
    <div className="social-buttons">
      <CutAndDownload width={bsPixels - 1} size="medium" />
      <FacebookShareButton url={url} quote={title}>
        <FacebookIcon size={bsPixels} round />
      </FacebookShareButton>
      <TwitterShareButton url={url} title={title}>
        <TwitterIcon size={bsPixels} round />
      </TwitterShareButton>
      <WhatsappShareButton url={url} title={title} separator=": ">
        <WhatsappIcon size={bsPixels} round />
      </WhatsappShareButton>
      <TelegramShareButton url={url} title={title}>
        <TelegramIcon size={bsPixels} round />
      </TelegramShareButton>
      <MailruShareButton url={url} title={title}>
        <MailruIcon size={bsPixels} round />
      </MailruShareButton>
      <EmailShareButton url={url} subject={title} body={url}>
        <EmailIcon size={bsPixels} round />
      </EmailShareButton>
      <EmbeddedShareButton url={url} bsPixels={bsPixels} />
    </div>
  );
};

export default withNamespaces()(ShareBarPlayer);

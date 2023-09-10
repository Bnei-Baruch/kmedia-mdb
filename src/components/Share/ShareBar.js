import React from 'react';
import { withTranslation } from 'next-i18next';
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
import EmbeddedShareButton from './EmbeddedShareButton';

const bsPixelsBySize = {
  tiny: 26,
  small: 36,
  big: 46,
};

const ShareBar = ({ url, t, }) => {

  const bsPixels = bsPixelsBySize.big;
  const title    = t('player.share.title');

  return (
    <div className="social-buttons">
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
      <EmbeddedShareButton url={url} size={'big'} />
    </div>
  );
};

export default withTranslation()(ShareBar);

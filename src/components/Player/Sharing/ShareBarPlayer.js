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
  OKShareButton,
  OKIcon
} from 'react-share';

import CutAndDownload from './TrimBtn';
import EmbeddedShareButton from './EmbeddedShareButton';
import { Popup } from 'semantic-ui-react';
import { useSelector } from 'react-redux';
import { selectors } from '../../../redux/modules/player';

const bsPixelsBySize = {
  tiny: 26,
  small: 36,
  big: 46,
};

const ShareBarPlayer = ({ t }) => {

  const bsPixels = bsPixelsBySize.small;
  const title    = t('player.share.title');
  const url      = useSelector(state => selectors.getShareUrl(state.player));

  return (
    <>
      <Popup
        content="Facebook"
        inverted
        size="mini"
        position="top center"
        trigger={
          <FacebookShareButton url={url} quote={title}>
            <FacebookIcon size={bsPixels} round />
          </FacebookShareButton>
        }
      />
      <Popup
        content="Twitter"
        inverted
        size="mini"
        position="top center"
        trigger={
          <TwitterShareButton url={url} title={title}>
            <TwitterIcon size={bsPixels} round />
          </TwitterShareButton>
        }
      />
      <Popup
        content="Whatsapp"
        inverted
        size="mini"
        position="top center"
        trigger={
          <WhatsappShareButton url={url} title={title} separator=": ">
            <WhatsappIcon size={bsPixels} round />
          </WhatsappShareButton>
        }
      />
      <Popup
        content="Telegram"
        inverted
        size="mini"
        position="top center"
        trigger={
          <TelegramShareButton url={url} title={title}>
            <TelegramIcon size={bsPixels} round />
          </TelegramShareButton>
        }
      />
      <Popup
        content="Odnoklassniki"
        inverted
        size="mini"
        position="top center"
        trigger={
          <OKShareButton url={url} title={title}>
            <OKIcon size={bsPixels} round />
          </OKShareButton>
        }
      />
      <Popup
        content="MailRu"
        inverted
        size="mini"
        position="top center"
        trigger={
          <MailruShareButton url={url} title={title}>
            <MailruIcon size={bsPixels} round />
          </MailruShareButton>
        }
      />
      <Popup
        content="Email"
        inverted
        size="mini"
        position="top center"
        trigger={
          <EmailShareButton url={url} subject={title} body={url}>
            <EmailIcon size={bsPixels} round />
          </EmailShareButton>
        }
      />
      <Popup
        content="Download file"
        inverted
        size="mini"
        position="top center"
        trigger={
          <CutAndDownload width={bsPixels - 1} size="medium" />
        }
      />
      <Popup
        content="Embed media"
        inverted
        size="mini"
        position="top center"
        trigger={
          <EmbeddedShareButton url={url} bsPixels={bsPixels} />
        }
      />
    </>
  );
};

export default withNamespaces()(ShareBarPlayer);

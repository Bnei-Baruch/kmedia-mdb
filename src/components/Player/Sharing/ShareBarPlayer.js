import React from 'react';
import { withNamespaces } from 'react-i18next';
import {
  EmailShareButton,
  FacebookShareButton,
  TelegramShareButton,
  TwitterShareButton,
  WhatsappShareButton,
  OKShareButton
} from 'react-share';

import CutAndDownload from './TrimBtn';
import EmbeddedShareButton from './EmbeddedShareButton';
import { Popup, Button } from 'semantic-ui-react';
import useShareUrl from '../hooks/useShareUrl';

const bsPixelsBySize = {
  tiny: 26,
  small: 36,
  big: 46,
};

const ShareBarPlayer = ({ t }) => {

  const bsPixels = bsPixelsBySize.small;
  const title    = t('player.share.title');
  const url      = useShareUrl();

  return (
    <>
      <Popup
        content="Facebook"
        inverted
        size="mini"
        position="top center"
        trigger={
          <FacebookShareButton url={url} quote={title}>
            <Button circular color="facebook" icon="facebook" />
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
            <Button circular color="twitter" icon="twitter" />
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
            <Button circular color="whatsapp" icon="whatsapp" />
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
            <Button circular color="telegram" icon="telegram" />
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
            <Button circular color="odnoklassniki" icon="odnoklassniki" />
          </OKShareButton>
        }
      />
      <Popup
        content="Email"
        inverted
        size="mini"
        position="top center"
        trigger={
          <EmailShareButton url={url} subject={title} body={url}>
            <Button circular icon="mail" />
          </EmailShareButton>
        }
      />
      <button className="custom_ShareButton">
        <Popup content="Download file" inverted size="mini" position="top center" trigger={
          <CutAndDownload />
        } />
      </button>

      <button className="custom_ShareButton">
        <Popup content="Embed media" inverted size="mini" position="top center" trigger={
          <EmbeddedShareButton url={url} bsPixels={bsPixels} />
        } />
      </button>
    </>
  );
};

export default withNamespaces()(ShareBarPlayer);

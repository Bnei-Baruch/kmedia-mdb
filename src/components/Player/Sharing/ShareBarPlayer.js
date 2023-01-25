import React, { useContext } from 'react';
import { withNamespaces } from 'react-i18next';
import {
  EmailShareButton,
  FacebookShareButton,
  TelegramShareButton,
  TwitterShareButton,
  WhatsappShareButton,
  OKShareButton
} from 'react-share';

import CutAndDownload from '../../Share/TrimBtn';
import EmbeddedShareButton from '../../Share/EmbeddedShareButton';
import { Button } from 'semantic-ui-react';
import useShareUrl from '../hooks/useShareUrl';
import WebWrapTooltip from '../../shared/WebWrapTooltip';
import { DeviceInfoContext } from '../../../helpers/app-contexts';

const ShareBarPlayer = ({ t }) => {
  const { isMobileDevice } = useContext(DeviceInfoContext);
  const title              = t('player.share.title');
  const url                = useShareUrl();

  return (
    <>
      <WebWrapTooltip
        content="Facebook"
        trigger={
          <FacebookShareButton url={url} quote={title}>
            <Button as="span" circular color="facebook" icon="facebook" />
          </FacebookShareButton>
        }
      />
      <WebWrapTooltip
        content="Twitter"
        trigger={
          <TwitterShareButton url={url} title={title}>
            <Button as="span" circular color="twitter" icon="twitter" />
          </TwitterShareButton>
        }
      />
      <WebWrapTooltip
        content="Whatsapp"
        trigger={
          <WhatsappShareButton url={url} title={title} separator=": ">
            <Button as="span" circular className="whatsapp" icon="whatsapp" />
          </WhatsappShareButton>
        }
      />
      <WebWrapTooltip
        content="Telegram"
        trigger={
          <TelegramShareButton url={url} title={title}>
            <Button as="span" circular icon="telegram" className="telegram" />
          </TelegramShareButton>
        }
      />
      <WebWrapTooltip
        content="Odnoklassniki"
        trigger={
          <OKShareButton url={url} title={title}>
            <Button as="span" circular icon="odnoklassniki" className="odnoklassniki" />
          </OKShareButton>
        }
      />
      <WebWrapTooltip
        content="Email"
        trigger={
          <EmailShareButton url={url} subject={title} body={url}>
            <Button as="span" circular icon="mail" />
          </EmailShareButton>
        }
      />
      {
        !isMobileDevice && (
          <>
            <WebWrapTooltip
              content={t('player.settings.download-file')}
              trigger={
                <CutAndDownload />
              } />
            <WebWrapTooltip
              content={t('player.share.embedded')}
              trigger={
                <EmbeddedShareButton url={url} />
              }
            />
          </>
        )
      }
    </>
  );
};

export default withNamespaces()(ShareBarPlayer);

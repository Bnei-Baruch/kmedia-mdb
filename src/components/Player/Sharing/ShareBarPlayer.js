import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
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
import useShareUrl from '../hooks/useShareUrl';
import WebWrapTooltip from '../../shared/WebWrapTooltip';
import { DeviceInfoContext } from '../../../helpers/app-contexts';

const SocialBtn = ({ className, children }) => (
  <span className={`inline-flex items-center justify-center w-9 h-9 rounded-full text-white cursor-pointer hover:opacity-80 small font-bold ${className}`}>
    {children}
  </span>
);

const ShareBarPlayer = () => {
  const { t } = useTranslation();
  const { isMobileDevice } = useContext(DeviceInfoContext);
  const title = t('player.share.title');
  const url = useShareUrl();

  return (
    <>
      <div className="relative">
        <WebWrapTooltip
          content="Facebook"
          trigger={
            <FacebookShareButton url={url} quote={title}>
              <SocialBtn className="bg-[#1877f2]">f</SocialBtn>
            </FacebookShareButton>
          }
        />
      </div>
      <div className="relative">
        <WebWrapTooltip
          content="Twitter"
          trigger={
            <TwitterShareButton url={url} title={title}>
              <SocialBtn className="bg-[#1da1f2]">𝕏</SocialBtn>
            </TwitterShareButton>
          }
        />
      </div>
      <div className="relative">
        <WebWrapTooltip
          content="Whatsapp"
          trigger={
            <WhatsappShareButton url={url} title={title} separator=": ">
              <SocialBtn className="whatsapp bg-[#25d366]">w</SocialBtn>
            </WhatsappShareButton>
          }
        />
      </div>
      <div className="relative">
        <WebWrapTooltip
          content="Telegram"
          trigger={
            <TelegramShareButton url={url} title={title}>
              <SocialBtn className="telegram bg-[#0088cc]">t</SocialBtn>
            </TelegramShareButton>
          }
        />
      </div>
      <div className="relative">
        <WebWrapTooltip
          content="Odnoklassniki"
          trigger={
            <OKShareButton url={url} title={title}>
              <SocialBtn className="odnoklassniki bg-[#ee8208]">ok</SocialBtn>
            </OKShareButton>
          }
        />
      </div>
      <div className="relative">
        <WebWrapTooltip
          content="Email"
          trigger={
            <EmailShareButton url={url} subject={title} body={url}>
              <SocialBtn className="bg-gray-600">
                <span className="material-symbols-outlined text-base">email</span>
              </SocialBtn>
            </EmailShareButton>
          }
        />
      </div>
      {
        !isMobileDevice && (
          <>
            <div className="bg-white text-gray-600 rounded-full flex items-center justify-center px-2 cursor-pointer">
              <WebWrapTooltip
                content={t('player.settings.download-file')}
                trigger={<CutAndDownload />} />

            </div>

            <div className="bg-white text-gray-600 rounded-full flex items-center justify-center cursor-pointer relative">
              <WebWrapTooltip
                content={t('player.share.embedded')}
                trigger={
                  <div>
                    <EmbeddedShareButton url={url} />
                  </div>
                }
              />
            </div>
          </>
        )
      }
    </>
  );
};

export default ShareBarPlayer;

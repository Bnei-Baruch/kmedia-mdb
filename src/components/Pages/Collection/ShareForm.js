import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  EmailIcon,
  EmailShareButton,
  FacebookIcon,
  FacebookShareButton,
  MailruIcon,
  MailruShareButton,
  OKIcon,
  OKShareButton,
  TelegramIcon,
  TelegramShareButton,
  TwitterIcon,
  TwitterShareButton,
  WhatsappIcon,
  WhatsappShareButton
} from 'react-share';

const RenderShare = ({ collection, callback, t }) => {
  const { name, description, content_type } = collection;

  const contentType = t(`constants.content-types.${content_type}`);

  let title         = `${contentType} "${name}"`;
  if (description) {
    title += `: ${description}`;
  }

  const url      = window.location;
  const bsPixels = 46;

  return (
    <div className="social-buttons">
      <div className="inline-block relative">
        <button onClick={() => callback()} className="absolute top-0 right-0 text-white bg-gray-600 rounded-full w-5 h-5 flex items-center justify-center hover:bg-gray-800">
          <span className="material-symbols-outlined small">close</span>
        </button>
      </div>
      <FacebookShareButton url={url} quote={title} onShareWindowClose={callback}>
        <FacebookIcon size={bsPixels} round />
      </FacebookShareButton>
      <TwitterShareButton url={url} title={title} onShareWindowClose={callback}>
        <TwitterIcon size={bsPixels} round />
      </TwitterShareButton>
      <WhatsappShareButton url={url} title={title} separator=" -- " onShareWindowClose={callback}>
        <WhatsappIcon size={bsPixels} round />
      </WhatsappShareButton>
      <TelegramShareButton url={url} title={title} onShareWindowClose={callback}>
        <TelegramIcon size={bsPixels} round />
      </TelegramShareButton>
      <MailruShareButton url={url} title={`${contentType} "${name}"`} description={description} onShareWindowClose={callback}>
        <MailruIcon size={bsPixels} round />
      </MailruShareButton>
      <OKShareButton url={url} title={`${contentType} "${name}"`} description={description} onShareWindowClose={callback}>
        <OKIcon size={bsPixels} round />
      </OKShareButton>
      <EmailShareButton url={url} subject={`${contentType} "${name}"`} body={description} onShareWindowClose={callback}>
        <EmailIcon size={bsPixels} round />
      </EmailShareButton>
    </div>
  );
};

const ShareForm = ({ collection }) => {
  const { t } = useTranslation();
  const [share, setShare] = useState(false);

  return (
    <>
      <button
        className="inline-flex items-center px-2 py-1 text-xs font-bold text-white bg-blue-600 rounded hover:bg-blue-700"
        onClick={() => setShare(!share)}
      >
        <span className="material-symbols-outlined small">share</span>
      </button>
      {
        share && <RenderShare collection={collection} callback={() => setShare(false)} t={t} />
      }
    </>
  );
};


export default ShareForm;

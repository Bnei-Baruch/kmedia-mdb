import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { withNamespaces } from 'react-i18next';
import { Button, Icon } from 'semantic-ui-react';
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
      <Icon.Group>
        <Icon name="close" onClick={() => callback()} corner="top right" inverted link circular fitted />
      </Icon.Group>
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

const ShareForm = ({ collection, t }) => {
  const [share, setShare] = useState(false);

  return (
    <>
      <Button
        size="mini"
        color="facebook"
        compact
        onClick={() => setShare(!share)}
      >
        <Icon
          name="share alternate"
          fitted
        />
      </Button>
      {
        share && <RenderShare collection={collection} callback={() => setShare(false)} t={t} />
      }
    </>
  );
};

ShareForm.propTypes = {
  t: PropTypes.func.isRequired,
};

export default withNamespaces()(ShareForm);

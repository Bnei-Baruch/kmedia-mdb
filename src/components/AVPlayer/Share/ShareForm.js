import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Button, Form, Message, Popup } from 'semantic-ui-react';
import CopyToClipboard from 'react-copy-to-clipboard';
import { withNamespaces } from 'react-i18next';
import { useSelector } from 'react-redux';

import { selectors as settings } from '../../../redux/modules/settings';
import { toHumanReadableTime } from '../../../helpers/time';
import { getQuery, splitPathByLanguage, stringify } from '../../../helpers/url';
import * as shapes from '../../shapes';
import ShareBar from './ShareBar';

const POPOVER_CONFIRMATION_TIMEOUT = 2500;

const getUrl = (item, uiLanguage, start, end, addUiLang) => {
  const { protocol, hostname, port, pathname } = window.location;
  // const { item, uiLanguage }                   = props;
  const path                 = item.shareUrl || pathname;
  const { path: pathSuffix } = splitPathByLanguage(path);
  const uiLang               = addUiLang ? `/${uiLanguage}` : '';
  const shareUrl             = `${protocol}//${hostname}${port ? `:${port}` : ''}${uiLang}${pathSuffix}`;

  const q  = getQuery(window.location);
  // Set start end points
  q.sstart = toHumanReadableTime(start);
  if (end) {
    q.send = toHumanReadableTime(end);
  }

  // Set media type
  if (item.mediaType) {
    q.mediaType = item.mediaType;
  }

  // Remove the currentTime param from the share url
  q.currentTime = null;

  if (!addUiLang) {
    q.shareLang = uiLanguage;
  }

  return `${shareUrl}?${stringify(q)}`;
}

// const colonStrToSecond = str => {
//   const s = str.replace(/[^\d:]+/g, '');

//   return s.split(':')
//     .map(t => (t ? parseInt(t, 10) : 0))
//     .reverse()
//     .reduce((result, t, i) => (result + (t * Math.pow(60, i))), 0);
// }

// const mlsToStrColon = seconds => {
//   const duration = new Date(seconds * 1000); // ms
//   const h        = duration.getUTCHours();
//   const m        = duration.getUTCMinutes();
//   const s        = duration.getUTCSeconds();
//   return h ? `${h}:${m}:${s}` : `${m}:${s}`;
// }

const getEmbed = url => {
  if (url) {
    const appendChar = url.indexOf('?') !== -1 ? '&' : '?';
    return `<iframe width="680" height="420" src="${url}${appendChar}embed=1&autoPlay=1" frameBorder="0" scrolling="no" allowfullscreen />`;
  }

  return null;

};

const ShareForm = ({ item, currentTime, duration, onSliceChange, onExit, t }) => {
  const uiLanguage  = useSelector(state => settings.getLanguage(state.settings));

  const [isCopyPopupOpen, setIsCopyPopupOpen] = useState(false);
  const [start, setStart] = useState(currentTime);
  const [end, setEnd] = useState(duration);

  const [url, setUrl] = useState();
  const [uiLangUrl, setUiLangUrl] = useState();

  useEffect(() => {
    setUrl(getUrl(item, uiLanguage, start, end));
    setUiLangUrl(getUrl(item, uiLanguage, start, end, true));
  }, [end, item, start, uiLanguage]);

  const handleCopied = () => {
    setIsCopyPopupOpen(true);
    setTimeout(() => setIsCopyPopupOpen(false), POPOVER_CONFIRMATION_TIMEOUT);
  };

  const setCutFrom = (e, data) => {
    console.log('setStartValue:', currentTime, e, data);
    setStart(currentTime);

    onSliceChange(start, end)
  };

  const setCutTo = () => {
    console.log('setEndValue:', currentTime);
    setEnd(currentTime);

    onSliceChange(start, end)
  };

  return (
    <div className="mediaplayer__onscreen-share">
      <Button
        className="mediaplayer__onscreen-share-back"
        content={t('player.buttons.edit-back')}
        primary
        icon="chevron left"
        onClick={onExit}
      />
      <ShareBar url={url} embedContent={getEmbed(uiLangUrl)} t={t} buttonSize="medium" />
      <div className="mediaplayer__onscreen-share-form">
        <div className="mediaplayer__onscreen-share-bar">
          <Message content={url} size="mini" />
          <Popup
            open={isCopyPopupOpen}
            content={t('messages.link-copied-to-clipboard')}
            position="bottom right"
            trigger={(
              <CopyToClipboard text={url} onCopy={handleCopied}>
                <Button //className="shareCopyLinkButton"
                  size="mini" content={t('buttons.copy')} />
              </CopyToClipboard>
            )}
          />
        </div>
        <Form>
          <Form.Group widths="equal">
            <Form.Input
              action={{
                content: t('player.buttons.start-position'),
                onClick: setCutFrom,
                icon: 'hourglass start',
                color: 'blue',
                size: 'mini',
                compact: true,
              }}
              onClick={setCutFrom}
              value={toHumanReadableTime(start)}
              // onChange={() => setStart(currentTime)}
              actionPosition="left"
              placeholder={t('player.buttons.click-to-set')}
            />
            <Form.Input
              action={{
                content: t('player.buttons.end-position'),
                onClick: setCutTo,
                icon: 'hourglass end',
                color: 'blue',
                size: 'mini',
                compact: true,
              }}
              value={toHumanReadableTime(end)}
              onClick={setCutTo}
              // input={{ readOnly: true }}
              actionPosition="left"
              placeholder={t('player.buttons.click-to-set')}
            />
          </Form.Group>
        </Form>
      </div>
    </div>
  );
}

ShareForm.propTypes = {
  item: shapes.VideoItem.isRequired,
  onSliceChange: PropTypes.func.isRequired,
  onExit: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
};

export default withNamespaces()(ShareForm);

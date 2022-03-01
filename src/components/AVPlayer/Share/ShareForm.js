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
  const [start, setStart] = useState();
  const [end, setEnd] = useState();

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

    onSliceChange(start, end || duration)
  };

  const setCutTo = () => {
    console.log('setEndValue:', currentTime);
    setEnd(currentTime);

    onSliceChange(start || currentTime, end)
  };

  return (
    <div className="mediaplayer__onscreen-share">
      <Form size='mini'>
        <Form.Group>
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
            actionPosition="left"
            placeholder={t('player.buttons.click-to-set')}
          />
          <Button
            className="mediaplayer__onscreen-share-back"
            content={t('player.buttons.edit-back')}
            primary
            compact
            size='mini'
            icon="chevron left"
            onClick={onExit}
          />
        </Form.Group>
        <Form.Group>
          <Message content={url} size="mini" />
          <Popup
            open={isCopyPopupOpen}
            content={t('messages.link-copied-to-clipboard')}
            position="bottom right"
            trigger={(
              <CopyToClipboard text={url} onCopy={handleCopied}>
                <Button className="shareCopyLinkButton" size="mini" compact content={t('buttons.copy')} />
              </CopyToClipboard>
            )}
          />
        </Form.Group>
        <div className="mediaplayer__onscreen-share-bar">
          <ShareBar url={url} embedContent={getEmbed(uiLangUrl)} t={t} buttonSize="small" />
        </div>
      </Form>
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

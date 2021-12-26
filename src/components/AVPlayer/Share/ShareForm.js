import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Button, Form, Message, Popup } from 'semantic-ui-react';
import CopyToClipboard from 'react-copy-to-clipboard';
import { withNamespaces } from 'react-i18next';
import { useSelector } from 'react-redux';
import { usePlayerContext } from '@vime/react';

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

const colonStrToSecond = str => {
  const s = str.replace(/[^\d:]+/g, '');

  return s.split(':')
    .map(t => (t ? parseInt(t, 10) : 0))
    .reverse()
    .reduce((result, t, i) => (result + (t * Math.pow(60, i))), 0);
}

const mlsToStrColon = seconds => {
  const duration = new Date(seconds * 1000); // ms
  const h        = duration.getUTCHours();
  const m        = duration.getUTCMinutes();
  const s        = duration.getUTCSeconds();
  return h ? `${h}:${m}:${s}` : `${m}:${s}`;
}

const getEmbed = url => {
  const appendChar = url.indexOf('?') !== -1 ? '&' : '?';
  return `<iframe width="680" height="420" src="${url}${appendChar}embed=1&autoPlay=1" frameBorder="0" scrolling="no" allowfullscreen />`;
};

const ShareForm = ({ player, item, onSliceChange, onExit, t }) => {
  const uiLanguage  = useSelector(state => settings.getLanguage(state.settings));

  const [duration]    = usePlayerContext(player, 'duration', 0);
  const [currentTime] = usePlayerContext(player, 'currentTime', 0);

  const [isCopyPopupOpen, setIsCopyPopupOpen] = useState(false);
  const [start, setStart] = useState(Math.round(currentTime));
  const [end, setEnd] = useState(Math.round(currentTime));

  const [url, setUrl] = useState();
  const [uiLangUrl, setUiLangUrl] = useState();

  useEffect(() => {
    setUrl(getUrl(item, uiLanguage, start, end));
    setUiLangUrl(getUrl(item, uiLanguage, start, end, true));
    onSliceChange(start, end);
  }, [end, item, onSliceChange, start, uiLanguage]);

  const handleCopied = () => {
    // clearTimeout();
    setIsCopyPopupOpen(true);
    setTimeout(() => setIsCopyPopupOpen(false), POPOVER_CONFIRMATION_TIMEOUT);

    // setState({ isCopyPopupOpen: true }, () => {
    //   timeout = setTimeout(() => setState({ isCopyPopupOpen: false }), POPOVER_CONFIRMATION_TIMEOUT);
    // });
  };

  const setStartValue = (e, data) => {
    // const { media, onSliceChange } = props;
    // const duration = Math.max(duration, 0);

    let newStart = data?.value
      ? colonStrToSecond(data.value)
      : Math.round(currentTime);
    newStart     = Math.min(newStart, duration);

    if (end < newStart) {
      setEnd(duration);
    }

    setStart(newStart);

    // let newEnd = end < newStart ? duration : end;
    // newEnd     = newEnd > newStart ? newEnd : duration;

    // setEnd(newEnd);

    // const state = { start: newStart, end: newEnd };
    // if (!newEnd) {
    //   delete state.end;
    //   newEnd = null;
    // }

    // setState({
    //   ...state,
    //   url: getUrl(props, newStart, newEnd),
    //   uiLangUrl: getUrl(props, newStart, newEnd, true),
    // });
    // onSliceChange(newStart, newEnd);
  };

  const setEndValue = (e, data) => {
    // const { media, onSliceChange } = props;
    // const duration                 = Math.max(media.duration, 0);

    let newEnd = data?.value
      ? colonStrToSecond(data.value)
      : Math.round(currentTime);
    newEnd = Math.min(newEnd, duration);

    if (start > newEnd) {
      setStart(0);
    }

    setEnd(newEnd);

    // setState({
    //   end, start,
    //   url: getUrl(props, start, end),
    //   uiLangUrl: getUrl(props, start, end, true),
    // });
    // onSliceChange(newStart, newEnd);
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
                <Button className="shareCopyLinkButton" size="mini" content={t('buttons.copy')} />
              </CopyToClipboard>
            )}
          />
        </div>
        <Form>
          <Form.Group widths="equal">
            <Form.Input
              value={start ? mlsToStrColon(start) : ''}
              onClick={setStartValue}
              action={{
                content: t('player.buttons.start-position'),
                onClick: setStartValue,
                icon: 'hourglass start',
                color: 'blue',
                size: 'mini',
                compact: true,
              }}
              input={{ readOnly: true }}
              actionPosition="left"
              placeholder={t('player.buttons.click-to-set')}
            />
            <Form.Input
              value={end ? mlsToStrColon(end) : ''}
              onClick={setEndValue}
              action={{
                content: t('player.buttons.end-position'),
                onClick: setEndValue,
                icon: 'hourglass end',
                color: 'blue',
                size: 'mini',
                compact: true,
              }}
              input={{ readOnly: true }}
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
  player: PropTypes.object,
  item: PropTypes.arrayOf(shapes.VideoItem).isRequired,
  onSliceChange: PropTypes.func.isRequired,
  onExit: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
};

export default withNamespaces()(ShareForm);

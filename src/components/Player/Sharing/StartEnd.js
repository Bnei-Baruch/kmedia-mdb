import { Input, Button } from 'semantic-ui-react';
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { toHumanReadableTime } from '../../../helpers/time';
import { useDispatch, useSelector } from 'react-redux';
import { actions } from '../../../redux/modules/player';
import { selectors as playlist } from '../../../redux/modules/playlist';
import { selectors as settings } from '../../../redux/modules/settings';
import { splitPathByLanguage } from '../../../helpers/url';

const StartEnd = () => {
  const [start, setStart] = useState(null);
  const [end, setEnd]     = useState(null);

  const location = useLocation();
  const dispatch = useDispatch();

  const { mediaType } = useSelector(state => playlist.getInfo(state.playlist));
  const language      = useSelector(state => settings.getLanguage(state.settings));

  useEffect(() => {
    const { protocol, hostname, port, pathname } = window.location;

    const { path } = splitPathByLanguage(pathname);

    const url = new URL(`${protocol}//${hostname}${port ? `:${port}` : ''}${path}`);
    (!!start) && url.searchParams.set('sstart', toHumanReadableTime(start));
    (!!end && end !== Infinity) && url.searchParams.set('send', toHumanReadableTime(end));
    url.searchParams.set('mediaType', mediaType);
    url.searchParams.set('shareLang', language);
    dispatch(actions.setShareUrl(url.toString()));
  }, [start, end, mediaType, language, location]);

  const handleSetStart = () => {
    const start = window.jwplayer().getPosition();
    if (start >= end) setEnd(Infinity);
    setStart(start);
  };

  const handleSetEnd = () => {
    const end = window.jwplayer().getPosition();
    if (end <= start) setStart(0);
    setEnd(end);
  };

  const handleSetFull = () => {
    setEnd(Infinity);
    setStart(0);
  };

  return (
    <>

      <div className="sharing__times">
        <div className="sharing__inputs">
          <Input
            size="mini"
            actionPosition="left"
            action={{
              content: 'start time',
              size: 'small',
              compact: true,
              onClick: handleSetStart
            }}
            placeholder="Click to set"
            value={toHumanReadableTime(start)}
          />
          <Input
            size="mini"
            actionPosition="left"
            action={{
              content: 'end time',
              size: 'small',
              compact: true,
              onClick: handleSetEnd
            }}
            placeholder="Click to set"
            value={toHumanReadableTime(end)}
          />
        </div>
      </div>

      <div className="sharing__reset" onClick={handleSetFull}>
        <Button size="small">Reset to full video</Button>
      </div>
    </>
  );
};

export default StartEnd;

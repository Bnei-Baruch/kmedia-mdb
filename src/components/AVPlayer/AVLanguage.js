import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { Dropdown, Button } from 'semantic-ui-react';

import { LANGUAGE_OPTIONS, LANGUAGES, JWPLAYER_ID } from '../../helpers/consts';
import TimedPopup from '../shared/TimedPopup';
import { useSelector, useDispatch } from 'react-redux';
import { selectors as settings } from '../../redux/modules/settings';
import { actions as playlistActions, selectors as playlistSelectors } from '../../redux/modules/playlist';
import { actions } from '../../redux/modules/player';

const AVLanguage = ({ languages, selectedLanguage, cuId, t, }) => {

  const uiLanguage   = useSelector(state => settings.getLanguage(state.settings));
  const { language } = useSelector(state => playlistSelectors.getInfo(state.playlist));

  const [openPopup, setOpenPopup] = useState(language !== selectedLanguage);
  const ref                       = useRef();

  const dispatch = useDispatch();

  const handleSelect = (e, { value }) => {
    dispatch(playlistActions.setLanguage(value));
    dispatch(actions.continuePlay(window.jwplayer(JWPLAYER_ID).getPosition()), );
  };

  const options = LANGUAGE_OPTIONS
    .filter(x => languages.includes(x.value))
    .map(x => ({ value: x.value, text: x.name }));

  return (
    <div ref={ref} className="mediaplayer__languages">
     {/* <TimedPopup
        openOnInit={openPopup}
        message={t('messages.fallback-language')}
        downward={false}
        timeout={7000}
        language={uiLanguage}
        refElement={ref}
        updateTrigger={cuId}
      />*/}
      <Dropdown
        scrolling
        upward
        icon={null}
        selectOnBlur={false}
        options={options}
        value={selectedLanguage}
        onChange={handleSelect}
        trigger={
          <Button icon="angle right" className="clear_button" color="red" basic content={LANGUAGES[selectedLanguage].name} />}
      />
    </div>
  );
};

AVLanguage.propTypes = {
  t: PropTypes.func.isRequired,
  selectedLanguage: PropTypes.string,
  languages: PropTypes.arrayOf(PropTypes.string),
  cuId: PropTypes.string
};

export default AVLanguage;

import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { noop } from '../../helpers/utils';

import { LANG_HEBREW, LANGUAGE_OPTIONS } from '../../helpers/consts';
import TimedPopup from '../shared/TimedPopup';

const AVLanguageMobile = (
  {
    languages = [],
    selectedLanguage = LANG_HEBREW,
    requestedLanguage = LANG_HEBREW,
    uiLanguage = LANG_HEBREW,
    onSelect = noop,
    t,
    cuId
  }
) => {
  const [lastRequestedLanguage, setLastRequestedLanguage] = useState(requestedLanguage);
  const [openPopup, setOpenPopup]                         = useState(false);
  const [langSelectRef, setLangSelectRef]                 = useState();

  const handleChange = e => {
    setLastRequestedLanguage(e.currentTarget.value)
    return onSelect(e, e.currentTarget.value);
  };

  useEffect(() => {
    setOpenPopup(selectedLanguage !== lastRequestedLanguage);
  }, [selectedLanguage, lastRequestedLanguage]);

  const options = LANGUAGE_OPTIONS
    .filter(x => languages.includes(x.value))
    .map(x => x.value);

  return (
    <div ref={setLangSelectRef} className="mediaplayer__languages">
      <TimedPopup
        openOnInit={openPopup}
        message={t('messages.fallback-language')}
        downward={false}
        timeout={7000}
        language={uiLanguage}
        refElement={langSelectRef}
        updateTrigger={cuId}
      />
      <select value={selectedLanguage} onChange={handleChange}>
        {
          options.map(x => (
            <option key={x} value={x}>
              {x}
            </option>
          ))
        }
      </select>
    </div>
  );
};

AVLanguageMobile.propTypes = {
  t: PropTypes.func.isRequired,
  onSelect: PropTypes.func,
  selectedLanguage: PropTypes.string,
  requestedLanguage: PropTypes.string,
  languages: PropTypes.arrayOf(PropTypes.string),
  uiLanguage: PropTypes.string,
  cuId: PropTypes.string
};

const areEqual = (prevProps, nextProps) =>
  prevProps.selectedLanguage === nextProps.selectedLanguage
  && prevProps.requestedLanguage === nextProps.requestedLanguage
  && prevProps.uiLanguage === nextProps.uiLanguage
  && prevProps.cuId === nextProps.cuId;

export default React.memo(AVLanguageMobile, areEqual);

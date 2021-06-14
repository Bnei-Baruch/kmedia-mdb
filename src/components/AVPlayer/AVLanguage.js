import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { noop } from '../../helpers/utils';
import { Dropdown } from 'semantic-ui-react';

import { LANG_HEBREW, LANGUAGE_OPTIONS } from '../../helpers/consts';
import TimedPopup from '../shared/TimedPopup';

const AVLanguage = (
  {
    languages = [],
    selectedLanguage = LANG_HEBREW,
    requestedLanguage = LANG_HEBREW,
    uiLanguage = LANG_HEBREW,
    onSelect = noop,
    onDropdownOpenedChange,
    t,
    cuId,
  }
) => {
  const [lastRequestedLanguage, setLastRequestedLanguage] = useState();
  const [openPopup, setOpenPopup]                         = useState(false);
  const [langSelectRef, setLangSelectRef]                 = useState();

  const handleChange  = (e, data) => {
    setLastRequestedLanguage(data.value);
    onSelect(e, data.value);
  };
  const handleOnOpen  = () => onDropdownOpenedChange(true);
  const handleOnClose = () => onDropdownOpenedChange(false);

  useEffect(() => {
    const requested = lastRequestedLanguage ? lastRequestedLanguage : requestedLanguage;
    setOpenPopup(selectedLanguage !== requested);
  }, [selectedLanguage, requestedLanguage, lastRequestedLanguage]);

  const options = LANGUAGE_OPTIONS
    .filter(x => languages.includes(x.value))
    .map(x => ({ value: x.value, text: x.value }));

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
      <Dropdown
        floating
        scrolling
        upward
        icon={null}
        selectOnBlur={false}
        options={options}
        value={selectedLanguage}
        onChange={handleChange}
        trigger={<button type="button">{selectedLanguage}</button>}
        onOpen={handleOnOpen}
        onClose={handleOnClose}
      />
    </div>
  );
};

AVLanguage.propTypes = {
  t: PropTypes.func.isRequired,
  onSelect: PropTypes.func,
  onDropdownOpenedChange: PropTypes.func.isRequired,
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
  && prevProps.languages === nextProps.languages
  && prevProps.cuId === nextProps.cuId;

export default React.memo(AVLanguage, areEqual);

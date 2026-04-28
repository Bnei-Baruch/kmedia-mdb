import React, { useContext, useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { clsx } from 'clsx';

import { DeviceInfoContext } from '../../../helpers/app-contexts';
import { noop } from '../../../helpers/utils';
import { getOptions } from '../../../helpers/language';
import { settingsGetContentLanguagesSelector, settingsGetUIDirSelector } from '../../../redux/selectors';

const MenuLanguageSelector = (
  {
    languages = [],
    selected = [],
    onLanguageChange = noop,
    multiSelect = true,
    upward = false
  }
) => {
  const uiDir              = useSelector(settingsGetUIDirSelector);
  const { isMobileDevice } = useContext(DeviceInfoContext);
  const contentLanguages   = useSelector(settingsGetContentLanguagesSelector);
  const onChange           = selected => {
    onLanguageChange(selected);
  };

  const validLanguages = languages.filter(lang => contentLanguages.includes(lang));
  const otherLanguages = languages.filter(lang => !contentLanguages.includes(lang));
  const dividerArray   = !isMobileDevice || multiSelect ? [{
    value    : 'divider',
    className: 'language-selection-divider disabled'
  }] : [];
  const options        = getOptions({ languages: validLanguages }).concat(dividerArray).concat(getOptions({ languages: otherLanguages }));
  // Special case when all laguages are selected, e.g., show content with any language.
  const isAny          = languages === selected;

  const value = multiSelect ? (isAny ? ['any'] : selected) : selected;

  if (isMobileDevice && !multiSelect) {
    return (
      <select
        className="language-mobile-select"
        style={{ direction: uiDir }}
        value={value}
        onChange={event => onChange(event.target.value)}>
        {options.map(x => <option key={`opt-${x.value}`} value={x.value}>{x.name}</option>)}
      </select>
    );
  }

  if (!multiSelect) {
    return (
      <select
        className="border rounded px-3 py-2 w-full"
        style={{ direction: uiDir }}
        value={value}
        onChange={event => onChange(event.target.value)}
      >
        {options.map(x => (
          x.value === 'divider'
            ? <option key="divider" disabled>───────</option>
            : <option key={x.value} value={x.value}>{x.text || x.name}</option>
        ))}
      </select>
    );
  }

  return (
    <MultiSelectDropdown
      upward={upward}
      value={value}
      onChange={onChange}
      options={options}
    />
  );
};

const MultiSelectDropdown = ({ upward, value, onChange, options }) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = event => {
      if (ref.current && !ref.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handler);
    }

    return () => document.removeEventListener('mousedown', handler);
  }, [isOpen]);

  const toggleValue = val => {
    if (Array.isArray(value)) {
      if (value.includes(val)) {
        onChange(value.filter(v => v !== val));
      } else {
        onChange([...value, val]);
      }
    } else {
      onChange(val);
    }
  };

  const displayText = Array.isArray(value)
    ? options.filter(o => value.includes(o.value)).map(o => o.text || o.name).join(', ') || ''
    : '';

  return (
    <div className="relative" ref={ref}>
      <button
        className="border rounded px-3 py-2 flex items-center gap-1 min-w-[200px] w-full text-left"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="flex-1 truncate">{displayText}</span>
        <span className="material-symbols-outlined small">arrow_drop_down</span>
      </button>
      {isOpen && (
        <div className={clsx('absolute z-20 bg-white border rounded shadow-lg max-h-60 overflow-y-auto w-full', { 'bottom-full mb-1': upward })}>
          {options.map(x => {
            if (x.value === 'divider') {
              return <hr key="divider" className="my-1" />;
            }

            const isSelected = Array.isArray(value) ? value.includes(x.value) : value === x.value;
            return (
              <div
                key={x.value}
                className={clsx('px-3 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2 small', { 'bg-blue-50': isSelected })}
                onClick={() => toggleValue(x.value)}
              >
                <input type="checkbox" checked={isSelected} readOnly className="pointer-events-none" />
                {x.text || x.name}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MenuLanguageSelector;

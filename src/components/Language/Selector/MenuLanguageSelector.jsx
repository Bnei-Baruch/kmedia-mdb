import { useContext, useRef, useState } from 'react';

import { useClickOutside } from '../../shared/useClickOutside';
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
    multiSelect = false,
    upward = false
  }
) => {
  const uiDir = useSelector(settingsGetUIDirSelector);
  const { isMobile } = useContext(DeviceInfoContext);
  const contentLanguages = useSelector(settingsGetContentLanguagesSelector);
  const onChange = selected => {
    onLanguageChange(selected);
  };

  const validLanguages = languages.filter(lang => contentLanguages.includes(lang));
  const otherLanguages = languages.filter(lang => !contentLanguages.includes(lang));
  const dividerArray = !isMobile || multiSelect ? [{
    value: 'divider',
    className: 'language-selection-divider disabled'
  }] : [];
  const options = getOptions({ languages: validLanguages }).concat(dividerArray).concat(getOptions({ languages: otherLanguages }));
  // Special case when all laguages are selected, e.g., show content with any language.
  const isAny = languages === selected;

  const value = multiSelect ? (isAny ? ['any'] : selected) : selected;

  if (isMobile && !multiSelect) {
    return (
      <select
        className="px-2 py-1 border rounded w-full text-sm text-black"
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
        className="border rounded px-2 py-1 w-full text-sm text-black"
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

  useClickOutside(() => setIsOpen(false), [ref]);

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

  const selectedOptions = Array.isArray(value)
    ? options.filter(o => value.includes(o.value))
    : [];

  return (
    <div className="relative" ref={ref}>
      <div
        className="border border-gray-300 rounded px-2 py-1 flex items-center gap-1 min-w-50 w-full text-left cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex flex-1 flex-wrap gap-1">
          {
            selectedOptions.map(o => (
              <div
                key={o.value}
                className="inline-flex items-center gap-0.5 bg-gray-100 border border-gray-300 rounded  py-0.5 px-1 text-sm leading-tight"
              >
                {o.text || o.name}
                <span
                  className="material-symbols-outlined leading-none text-gray-400 hover:text-gray-600 cursor-pointer text-xl"
                  onClick={e => {
                    e.stopPropagation();
                    toggleValue(o.value);
                  }}
                >close</span>
              </div>
            ))
          }
        </div>
        <span className="material-symbols-outlined text-2xl">arrow_drop_down</span>
      </div>
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

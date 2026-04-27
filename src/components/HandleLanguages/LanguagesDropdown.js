import React, { useEffect, useRef, useState } from 'react';

import { ALL_LANGUAGES, LANGUAGES } from '../../helpers/consts';
import Link from '../Language/MultiLanguageLink';

const LanguagesDropdown = ({ disabled, trigger, language, selected, asLink }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = event => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      <div
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={disabled ? 'opacity-50 pointer-events-none' : 'cursor-pointer'}
      >
        {trigger || (
          <button disabled={disabled} className="flex items-center gap-1 px-2 py-1">
            <span className="material-symbols-outlined small">arrow_drop_down</span>
          </button>
        )}
      </div>
      {isOpen && (
        <div className="absolute z-20 bg-white border rounded shadow-lg max-h-60 overflow-y-auto min-w-[150px]">
          {ALL_LANGUAGES.map(lang => {
            const isActive = lang === language;
            const className = `block px-4 py-2 hover:bg-gray-100 cursor-pointer small ${isActive ? 'bg-blue-50 font-bold' : ''}`;

            if (asLink) {
              return (
                <Link
                  key={lang}
                  language={`${lang}`}
                  className={className}
                  onClick={() => {
                    selected(lang);
                    setIsOpen(false);
                  }}
                >
                  {LANGUAGES[lang].name}
                </Link>
              );
            }

            return (
              <div
                key={lang}
                className={className}
                onClick={() => {
                  selected(lang);
                  setIsOpen(false);
                }}
              >
                {LANGUAGES[lang].name}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default LanguagesDropdown;

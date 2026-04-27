import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Popover, PopoverButton, PopoverPanel } from '@headlessui/react';

import { useTranslation } from 'react-i18next';
import { LANGUAGES, LANG_UI_LANGUAGES } from '../../helpers/consts';
import { updateHtmlLang } from '../../helpers/language';
import { backendApi } from '../../redux/api/backendApi';
import { wholeMusic } from '../../redux/api/music';
import { wholeSimpleMode } from '../../redux/api/simpleMode';
import { actions } from '../../redux/modules/settings';
import {
  settingsGetContentLanguagesSelector,
  settingsGetLeftRightByDirSelector,
  settingsGetShowAllContentSelector,
  settingsGetUIDirSelector,
  settingsGetUILangSelector,
  settingsGetUrlLangSelector,
} from '../../redux/selectors';
import Link from '../Language/MultiLanguageLink';
import LanguageItem from './LanguageItem';
import LanguagesBtn from './LanguagesBtn';
import LanguagesDropdown from './LanguagesDropdown';

const HandleLanguages = () => {
  const { t } = useTranslation();

  const [uiLangOpen, setUiLangOpen] = useState(false);
  const uiLangRef = useRef(null);
  const showAllContent = useSelector(settingsGetShowAllContentSelector);

  const urlLang = useSelector(settingsGetUrlLangSelector);
  const origUILang = useSelector(state => settingsGetUILangSelector(state, true /* skipUrl */));
  const uiDir = useSelector(settingsGetUIDirSelector);
  const leftRight = useSelector(settingsGetLeftRightByDirSelector);
  const contentLanguages = useSelector(state => settingsGetContentLanguagesSelector(state, true /* skipUrl */));
  const popupStyle = { direction: uiDir };
  const dispatch = useDispatch();

  console.log('HandleLanguages render', contentLanguages, urlLang, origUILang, uiDir, leftRight, showAllContent);

  useEffect(() => {
    const handler = event => {
      if (uiLangRef.current && !uiLangRef.current.contains(event.target)) {
        setUiLangOpen(false);
      }
    };

    if (uiLangOpen) {
      document.addEventListener('mousedown', handler);
    }

    return () => document.removeEventListener('mousedown', handler);
  }, [uiLangOpen]);

  const uiLanguageSelected = language => {
    updateHtmlLang(language);
    dispatch(actions.setUILanguage({ uiLang: language }));
    dispatch(backendApi.util.invalidateTags([wholeSimpleMode, wholeMusic]));
  };

  const addLanguage = language => {
    const newLanguages = contentLanguages.filter(lang => lang !== language);
    newLanguages.push(language);
    dispatch(actions.setContentLanguages({ contentLanguages: newLanguages }));
    dispatch(backendApi.util.invalidateTags([wholeSimpleMode, wholeMusic]));
  };

  const setShowAllContent = () => dispatch(actions.setShowAllContent(!showAllContent));

  const anchor = leftRight === 'right' ? 'bottom end' : 'bottom start';

  return (
    <Popover className="relative" id="handleLanguagesPopup">
      <PopoverButton as={LanguagesBtn} />
      <PopoverPanel
        anchor={anchor}
        className="z-50 mt-2 bg-white rounded-md shadow-lg ring-1 ring-black/5 p-4 min-w-[280px]"
        style={popupStyle}
      >
        {urlLang && (
          <div className="language-url">
            {t('languages.url_language_prefix', { lang: LANGUAGES[urlLang].name })}
            <Link language={origUILang}>{t('languages.url_language_here')}</Link>
            {t('languages.url_language_suffix')}
          </div>
        )}
        {
          <div className="language-ui">
            <h4 className={`margin-left-4 margin-right-4 ${urlLang ? 'disabled' : ''}`}>
              {t('languages.ui_language')}
            </h4>
            <div className="relative inline-block" ref={uiLangRef}>
              <button
                disabled={!!urlLang}
                className="flex items-center gap-1 px-2 py-1 disabled:opacity-50"
                onClick={() => setUiLangOpen(!uiLangOpen)}
              >
                {LANGUAGES[origUILang].name}
                <span className="material-symbols-outlined small">arrow_drop_down</span>
              </button>
              {uiLangOpen && (
                <div className="absolute z-20 bg-white border rounded shadow-lg max-h-60 overflow-y-auto min-w-[150px]">
                  {LANG_UI_LANGUAGES.map(lang => (
                    <Link
                      key={lang}
                      language={`${lang}`}
                      className={`block px-4 py-2 hover:bg-gray-100 cursor-pointer small ${lang === origUILang ? 'bg-blue-50 font-bold' : ''}`}
                      onClick={() => {
                        uiLanguageSelected(lang);
                        setUiLangOpen(false);
                      }}
                    >
                      {LANGUAGES[lang].name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        }
        <h4 className="content-languages-title">{t('languages.content_languages')}</h4>
        <ul className="divide-y">
          {contentLanguages.map((language, idx) => (
            <LanguageItem
              key={language}
              idx={idx}
              language={language}
              disabled={!!urlLang || contentLanguages.length === 1}
            />
          ))}
          <li key="last" className="language-not-celled list-none">
            <LanguagesDropdown
              disabled={!!urlLang}
              trigger={
                <button disabled={!!urlLang} className="border border-gray-400 text-gray-600 rounded px-3 py-1 small disabled:opacity-50">
                  {t('languages.add_languages')}
                </button>
              }
              selected={lang => addLanguage(lang)}
            />
          </li>
        </ul>
        <label className="language-checkbox flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            disabled={!!urlLang}
            checked={showAllContent}
            onChange={setShowAllContent}
          />
          {t('languages.show_all_content')}
        </label>
        <div className="language-subtext">{t('languages.show_all_content_explanation')}</div>
      </PopoverPanel>
    </Popover>
  );
};

export default HandleLanguages;

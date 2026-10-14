import { faArrowRight, faSearch, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { Combobox, ComboboxInput, ComboboxOption, ComboboxOptions } from '@headlessui/react';
import dayjs from '../../helpers/dayjs';
import { useContext, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { ClientChroniclesContext, DeviceInfoContext } from '../../helpers/app-contexts';
import { isLanguageRtl } from '../../helpers/i18n-utils';
import { SuggestionsHelper } from '../../helpers/search';
import ButtonDayPicker from '../shared/DayPicker/ButtonDayPicker';

import { clsx } from 'clsx';
import {
  actions,
  isAgenticSearchType,
  REASONING_QUERY_TOO_LONG_ERROR,
  SEARCH_TYPES
} from '../../redux/modules/search';
import {
  searchGetAutocompleteWipSelector,
  searchGetQuerySelector,
  searchGetReasoningRequestKindSelector,
  searchGetReasoningStatusSelector,
  searchGetSearchTypeSelector,
  searchGetSuggestionsSelector,
  settingsGetUILangSelector,
} from '../../redux/selectors';
import Icon from '../Icon';

const makeResult = (uiLang, result) => ({
  ...result,
  className: isLanguageRtl(uiLang) ? 'search-result-rtl' : '',
});

const OmniBox = ({ isHomePage = false }) => {
  const { t } = useTranslation();
  const query = useSelector(searchGetQuerySelector);
  const suggestions = useSelector(searchGetSuggestionsSelector);
  const wip = useSelector(searchGetAutocompleteWipSelector);
  const reasoningRequestKind = useSelector(searchGetReasoningRequestKindSelector);
  const reasoningStatus = useSelector(searchGetReasoningStatusSelector);
  const searchType = useSelector(searchGetSearchTypeSelector);
  const uiLang = useSelector(settingsGetUILangSelector);

  const { isMobile } = useContext(DeviceInfoContext);
  const chronicles = useContext(ClientChroniclesContext);

  const [autocompleteResults, setAutocompleteResults] = useState([]);
  const [autocompleteId, setAutocompleteId] = useState('');
  const [inputFocused, setInputFocused] = useState(!isMobile);
  const [userInteracted, setUserInteracted] = useState(false);

  const queryInputRef = useRef(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const agenticQuery = (query || '').trim();
  const agenticResult = agenticQuery ? makeResult(uiLang, {
    key: `agentic_${agenticQuery}`,
    title: t('search.agentic.autocompleteAsk', { query: agenticQuery }),
    description: t('search.agentic.autocompleteDescription'),
    agenticQuery
  }) : null;
  const displayedAutocompleteResults = agenticResult
    ? [agenticResult, ...autocompleteResults]
    : autocompleteResults;
  const isQueryTooLong = (
    isAgenticSearchType(searchType)
    && reasoningRequestKind !== 'followup'
    && reasoningStatus?.code === REASONING_QUERY_TOO_LONG_ERROR
  );

  useEffect(() => {
    if (isQueryTooLong && queryInputRef.current) {
      queryInputRef.current.focus();
      queryInputRef.current.select();
    }
  }, [isQueryTooLong]);

  useEffect(() => {
    if (suggestions) {
      const helper = new SuggestionsHelper(suggestions);
      setAutocompleteId(helper.autocompleteId);
      setAutocompleteResults(helper.getSuggestions().map(s => makeResult(uiLang, { key: s, title: s })));
    } else {
      setAutocompleteResults([]);
      setAutocompleteId('');
    }
  }, [suggestions, uiLang]);

  useEffect(() => {
    dispatch(actions.hydrateUrl({ searchAfterHydrate: true }));
  }, [dispatch]);

  const doSearch = () => {
    setUserInteracted(true);
    setInputFocused(false);
    dispatch(actions.search());
  };

  const keyDown = e => {
    if (e.keyCode === 13) {
      doSearch();
    }
  };

  const inputChange = e => {
    setUserInteracted(true);
    setInputFocused(true);
    dispatch(actions.updateQuery({ query: e.target.value, autocomplete: true }));
  };

  const onFocus = () => {
    setInputFocused(true);
  };

  const onBlur = () => {
    setInputFocused(false);
    setUserInteracted(true);
  };

  const handleResultSelect = title => {
    if (!title) return;
    const isAgenticResult = !!agenticResult && title === agenticResult.title;
    const selectedQuery = isAgenticResult ? agenticResult.agenticQuery : title;
    chronicles.autocompleteSelected(selectedQuery, autocompleteId);
    dispatch(actions.updateQuery({ query: selectedQuery, autocomplete: false }));
    if (isAgenticResult) {
      setUserInteracted(true);
      setInputFocused(false);
      dispatch(actions.setSearchType(SEARCH_TYPES.AGENTIC_RAPID));
      dispatch(actions.search());
      return;
    }

    doSearch();
  };

  const renderAutocompleteResult = result => {
    if (result.agenticQuery) {
      return (
        <div className="search-omnibox__agentic-row">
          <span className="search-omnibox__agentic-sparkle" aria-hidden="true">&#10022;</span>
          <div className="search-omnibox__result-copy">
            <div className="title">{result.title}</div>
            <div className="text-[13px] text-black/60">{result.description}</div>
          </div>
          <Icon icon={faArrowRight} className="text-[#aab2bc] rtl:-scale-x-100" />
        </div>
      );
    }

    return result.title;
  };

  const handleFromInputChange = value => {
    navigate(`/${uiLang}/simple-mode?date=${dayjs(value).format('YYYY-MM-DD')}`);
  };

  return (
    <Combobox value={query ?? ''} onChange={handleResultSelect} className={clsx('mx-auto', { 'max-w-[800px]': !isHomePage })}>
      <div className={clsx('relative w-full search-omnibox', { 'homepage': isHomePage, 'search-omnibox--query-error': isQueryTooLong })}>
        <div className={clsx('flex items-stretch w-full')}>
          <ComboboxInput
            ref={queryInputRef}
            className={clsx(
              'flex-1 bg-white px-4 outline-none w-full border rounded-4xl',
              isHomePage
                ? 'py-[11px] leading-[1.21428571em] text-black/80 border-[rgba(34,36,38,0.15)] focus:border-[#7dcff5] rounded-e-none'
                : 'py-2 text-black border-gray-300'
            )}
            placeholder={isHomePage ? `${t('buttons.search')}...` : ''}
            onChange={inputChange}
            onKeyDown={keyDown}
            onFocus={onFocus}
            onBlur={onBlur}
            autoFocus={inputFocused}
            displayValue={item => item}
          />
          {isHomePage ? (
            <>
              <button
                type="button"
                onClick={doSearch}
                className={clsx('flex items-center gap-1.5 ps-[15px] py-[11px] font-bold bg-[#e0e1e2] hover:bg-[#cacbcd] rounded-e text-[14px] leading-none text-black/60 whitespace-nowrap cursor-pointer', isMobile ? 'pe-[12px] me-[5px]' : 'pe-[21px] me-[45px]')}
              >
                {wip ? (
                  <Icon icon={faSpinner} className="animate-spin" />
                ) : (
                  <Icon icon={faSearch} />
                )}
                {!isMobile ? t('buttons.search').toUpperCase() : null}
              </button>
              <ButtonDayPicker
                label={t('filters.date-filter.presets.CUSTOM_DAY')}
                onDayChange={handleFromInputChange}
              />
            </>
          ) : (
            <button type="button" onClick={doSearch} className="omnibox-inline-search">
              {wip ? <Icon icon={faSpinner} className="animate-spin" /> : <Icon icon={faSearch} />}
            </button>
          )}
        </div>

        {userInteracted && inputFocused && displayedAutocompleteResults.length > 0 && (
          <ComboboxOptions
            static
            className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded shadow-lg max-h-60 overflow-auto"
          >
            {displayedAutocompleteResults.map(result => (
              <ComboboxOption
                key={result.key}
                value={result.title}
                className={({ active }) =>
                  clsx(
                    'cursor-pointer select-none relative py-2 px-4',
                    active ? 'bg-gray-100 text-black' : 'text-gray-900',
                    result.className
                  )
                }
              >
                {renderAutocompleteResult(result)}
              </ComboboxOption>
            ))}
          </ComboboxOptions>
        )}
      </div>
    </Combobox>
  );
};

export default OmniBox;

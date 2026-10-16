import { faArrowRight, faSearch, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { Combobox, ComboboxInput, ComboboxOption, ComboboxOptions } from '@headlessui/react';
import dayjs from '../../helpers/dayjs';
import { useContext, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';

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
  searchGetSmartLiveSelector,
  searchGetSuggestionsSelector,
  settingsGetUILangSelector,
} from '../../redux/selectors';
import Icon from '../Icon';
import SmartFilterChips from './SmartFilters/SmartFilterChips';
import SmartProposal from './SmartFilters/SmartProposal';
import useSmartChips from './SmartFilters/useSmartChips';

const makeResult = (uiLang, result) => ({
  ...result,
  className: isLanguageRtl(uiLang) ? 'search-result-rtl' : '',
});

const SMART_OPTION_PREFIX = 'smart:';
const MAX_SMART_PROPOSALS = 6;

const OmniBox = ({ isHomePage = false }) => {
  const { t } = useTranslation();
  const query = useSelector(searchGetQuerySelector);
  const suggestions = useSelector(searchGetSuggestionsSelector);
  const wip = useSelector(searchGetAutocompleteWipSelector);
  const reasoningRequestKind = useSelector(searchGetReasoningRequestKindSelector);
  const reasoningStatus = useSelector(searchGetReasoningStatusSelector);
  const searchType = useSelector(searchGetSearchTypeSelector);
  const uiLang = useSelector(settingsGetUILangSelector);
  const smartLive = useSelector(searchGetSmartLiveSelector);

  const { isMobile } = useContext(DeviceInfoContext);
  const chronicles = useContext(ClientChroniclesContext);

  const [autocompleteResults, setAutocompleteResults] = useState([]);
  const [autocompleteId, setAutocompleteId] = useState('');
  const [inputFocused, setInputFocused] = useState(!isMobile);
  const [userInteracted, setUserInteracted] = useState(false);

  const queryInputRef = useRef(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  // Smart search chips live in the header omnibox of the search page only.
  const showChips = !isHomePage && /\/search\/?$/.test(pathname);
  const { chips, removeChip, broadenChip, labelOf } = useSmartChips();
  const visibleChips = showChips ? chips : [];
  const agenticQuery = (query || '').trim();
  const agenticResult = agenticQuery ? makeResult(uiLang, {
    key: `agentic_${agenticQuery}`,
    title: t('search.agentic.autocompleteAsk', { query: agenticQuery }),
    description: t('search.agentic.autocompleteDescription'),
    agenticQuery
  }) : null;
  // Filters proposed while typing (smart search); picking one turns it into a chip.
  const smartResults = smartLive
    .flatMap(({ mention, items }) => items.map(item => ({ mention, item })))
    .slice(0, MAX_SMART_PROPOSALS)
    .map(({ mention, item }) => ({ key: `${SMART_OPTION_PREFIX}${item.slot}:${item.value}`, title: `${SMART_OPTION_PREFIX}${item.slot}:${JSON.stringify(item.value)}`, smart: { mention, item } }));
  const displayedAutocompleteResults = [
    ...(agenticResult ? [agenticResult] : []),
    ...smartResults,
    ...autocompleteResults
  ];
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
    // Regular search keeps the smart filter chips; agentic gets the raw query.
    dispatch(isAgenticSearchType(searchType) ? actions.search() : actions.smartSearch());
  };

  const keyDown = e => {
    if (e.keyCode === 13) {
      doSearch();
    }

    if (e.key === 'Backspace' && !e.target.value && visibleChips.length) {
      removeChip(visibleChips[visibleChips.length - 1]);
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
    const smartResult = smartResults.find(r => r.title === title);
    if (smartResult) {
      dispatch(actions.smartAcceptSuggestion(smartResult.smart));
      return;
    }

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
    if (result.smart) {
      const { mention, item } = result.smart;
      return <SmartProposal item={item} mention={mention} label={labelOf(item.name, item.value, item.path || mention)}/>;
    }

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
          <div
            className={clsx(
              'flex-1 flex items-center gap-1 min-w-0',
              !isHomePage && 'bg-white px-4 py-2 pe-10 border border-gray-300 rounded-4xl'
            )}
          >
            <SmartFilterChips chips={visibleChips} onRemove={removeChip} onBroaden={broadenChip}/>
            <ComboboxInput
              ref={queryInputRef}
              className={clsx(
                'flex-1 min-w-[120px] outline-none w-full',
                isHomePage
                  ? 'bg-white px-4 border rounded-4xl py-[11px] leading-[1.21428571em] text-black/80 border-[rgba(34,36,38,0.15)] focus:border-[#7dcff5] rounded-e-none'
                  : 'bg-transparent text-black'
              )}
              placeholder={isHomePage ? `${t('buttons.search')}...` : ''}
              onChange={inputChange}
              onKeyDown={keyDown}
              onFocus={onFocus}
              onBlur={onBlur}
              autoFocus={inputFocused}
              displayValue={item => item}
            />
          </div>
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

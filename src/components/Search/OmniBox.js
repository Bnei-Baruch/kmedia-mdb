import React, { useState, useContext, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Button, Icon, Input, Loader, Search } from 'semantic-ui-react';
import { withTranslation } from 'react-i18next';
import moment from 'moment';

import ButtonDayPicker from '../Filters/components/Date/ButtonDayPicker';
import { ClientChroniclesContext, DeviceInfoContext } from '../../helpers/app-contexts';
import { SuggestionsHelper } from '../../helpers/search';
import { isLanguageRtl } from '../../helpers/i18n-utils';

import { actions, SEARCH_TYPES } from '../../redux/modules/search';
import {
  searchGetAutocompleteWipSelector,
  searchGetQuerySelector,
  searchGetSuggestionsSelector,
  settingsGetUILangSelector
} from '../../redux/selectors';

const makeResult = (uiLang, result) => ({
  ...result,
  className: isLanguageRtl(uiLang) ? 'search-result-rtl' : ''
});

const OmniBox = ({ isHomePage = false, t }) => {
  const query       = useSelector(searchGetQuerySelector);
  const suggestions = useSelector(searchGetSuggestionsSelector);
  const wip         = useSelector(searchGetAutocompleteWipSelector);
  const uiLang      = useSelector(settingsGetUILangSelector);

  const { isMobileDevice } = useContext(DeviceInfoContext);
  const chronicles         = useContext(ClientChroniclesContext);

  const [autocompleteResults, setAutocompleteResults] = useState([]);
  const [autocompleteId, setAutocompleteId]           = useState('');
  const [inputFocused, setInputFocused]               = useState(!isMobileDevice);
  const [userInteracted, setUserInteracted]           = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const agenticQuery = (query || '').trim();
  const agenticResult = agenticQuery ? makeResult(uiLang, {
    key          : `agentic_${agenticQuery}`,
    title        : t('search.agentic.autocompleteAsk', { query: agenticQuery }),
    description  : t('search.agentic.autocompleteDescription'),
    agenticQuery
  }) : null;
  const displayedAutocompleteResults = agenticResult
    ? [agenticResult, ...autocompleteResults]
    : autocompleteResults;

  useEffect(() => {
    if (suggestions) {
      const helper = new SuggestionsHelper(suggestions);
      setAutocompleteId(helper.autocompleteId);
      const suggestionResults = helper.getSuggestions().map(s => (makeResult(uiLang, { key: s, title: s })));
      setAutocompleteResults(suggestionResults);
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

  const handleResultSelect = (e, data) => {
    const { title, agenticQuery } = data.result;
    const isAgenticResult = !!agenticResult && (
      agenticQuery === agenticResult.agenticQuery || title === agenticResult.title
    );
    const selectedQuery = isAgenticResult ? agenticResult.agenticQuery : title;
    chronicles.autocompleteSelected(selectedQuery, autocompleteId);
    dispatch(actions.updateQuery({ query: selectedQuery, autocomplete: false }));
    if (isAgenticResult) {
      dispatch(actions.setSearchType(SEARCH_TYPES.AGENTIC_RAPID));
      dispatch(actions.search());
      return;
    }

    doSearch();
  };

  const handleFromInputChange = value => {
    navigate(`/${uiLang}/simple-mode?date=${moment(value).format('YYYY-MM-DD')}`);
  };

  const renderAutocompleteResult = result => {
    if (result.agenticQuery) {
      return (
        <div className="search-omnibox__agentic-row">
          <span className="search-omnibox__agentic-sparkle" aria-hidden="true">&#10022;</span>
          <div className="search-omnibox__result-copy">
            <div className="title">{result.title}</div>
            <div className="description">{result.description}</div>
          </div>
          <Icon name="arrow right" className="search-omnibox__agentic-arrow" />
        </div>
      );
    }

    return (
      <div className="content">
        <div className="search-omnibox__result-copy">
          <div className="title">{result.title}</div>
          {result.description && <div className="description">{result.description}</div>}
        </div>
      </div>
    );
  };

  const renderInput = () => isHomePage ?
    <Input
      autoFocus={inputFocused}  // auto focus on desktop only.
      onFocus={onFocus}
      onBlur={onBlur}
      onChange={inputChange}
      onKeyDown={keyDown}
      className={'right action'}
      icon={null}
      input={null}
      placeholder={`${t('buttons.search')}...`}
      style={{ width: '100%' }}
      type="text">
      <input/>
      <Button type="submit" className="searchButton" onClick={doSearch}>
        {/* fix isLanguageRtl for style below */}
        {wip ? <Loader active size="tiny" style={{ position: 'relative', left: '0', marginLeft: '4px' }}/> :
          <Icon name="search" size={isMobileDevice ? 'large' : null}/>
        }
        {!isMobileDevice ? t('buttons.search').toUpperCase() : null}
      </Button>
      <ButtonDayPicker
        label={t('filters.date-filter.presets.CUSTOM_DAY')}
        onDayChange={handleFromInputChange}/>

    </Input> :
    <Input
      autoFocus={inputFocused}  // auto focus on desktop only.
      onChange={inputChange}
      onKeyDown={keyDown}
      onFocus={onFocus}
      onBlur={onBlur}
    />;

  return <Search
    fluid
    className="search-omnibox"
    size="small"
    results={displayedAutocompleteResults}
    open={userInteracted && inputFocused && !!displayedAutocompleteResults.length}
    value={query}
    input={renderInput()}
    icon={<Icon link name="search" onClick={doSearch}/>}
    showNoResults={false}
    loading={wip}
    resultRenderer={renderAutocompleteResult}
    onResultSelect={handleResultSelect}
  />;
};

export default withTranslation()(OmniBox);

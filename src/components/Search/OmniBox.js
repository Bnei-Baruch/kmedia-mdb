import React, { useState, useContext, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { Button, Icon, Input, Loader, Search } from 'semantic-ui-react';
import { withNamespaces } from 'react-i18next';
import moment from 'moment';

import ButtonDayPicker from '../Filters/components/Date/ButtonDayPicker';
import { ClientChroniclesContext, DeviceInfoContext } from '../../helpers/app-contexts';
import { SuggestionsHelper } from '../../helpers/search';
import { isLanguageRtl } from '../../helpers/i18n-utils';

import { actions, selectors } from '../../redux/modules/search';
import { selectors as settingsSelectors } from '../../redux/modules/settings';

const makeResult = (language, result) => ({
  ...result,
  className: isLanguageRtl(language) ? 'search-result-rtl' : '',
});

const OmniBox = ({ isHomePage = false, t }) => {
  const query = useSelector(state => selectors.getQuery(state.search));
  const suggestions = useSelector(state => selectors.getSuggestions(state.search));
  const wip = useSelector(state => selectors.getAutocompleteWip(state.search));
  const language = useSelector(state => settingsSelectors.getLanguage(state.settings));

  const { isMobileDevice } = useContext(DeviceInfoContext);
  const chronicles = useContext(ClientChroniclesContext);

  const [autocompleteResults, setAutocompleteResults] = useState([]);
  const [autocompleteId, setAutocompleteId] = useState('');
  const [inputFocused, setInputFocused] = useState(!isMobileDevice);
  const [userInteracted, setUserInteracted] = useState(false);

  const dispatch = useDispatch();
  const history = useHistory();

  useEffect(() => {
    if (suggestions) {
      const helper = new SuggestionsHelper(suggestions);
      setAutocompleteId(helper.autocompleteId);
      setAutocompleteResults(helper.getSuggestions().map(s => (makeResult(language, { key: s, title: s }))));
    } else {
      setAutocompleteResults([]);
      setAutocompleteId('');
    }
  }, [suggestions, language]);

  useEffect(() => {
    dispatch(actions.hydrateUrl());
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
  }

  const inputChange = e => {
    setUserInteracted(true);
    setInputFocused(true);
    dispatch(actions.updateQuery({ query: e.target.value, autocomplete: true }));
  }

  const onFocus = () => {
    setInputFocused(true);
  }

  const onBlur = () => {
    setInputFocused(false);
    setUserInteracted(true);
  }

  const handleResultSelect = (e, data) => {
    const { title } = data.result;
    chronicles.autocompleteSelected(title, autocompleteId);
    dispatch(actions.updateQuery({ query: title, autocomplete: false }));
    doSearch();
  };

  const handleFromInputChange = value => {
    history.push(`/${ language }/simple-mode?date=${ moment(value).format('YYYY-MM-DD') }`);
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
      <input />
      <Button type='submit' className="searchButton" onClick={doSearch}>
        {/* fix isLanguageRtl for style below */}
        {wip ? <Loader active size='tiny' style={{ position: 'relative', left: '0', marginLeft: '4px' }}/> :
          <Icon name='search' size={isMobileDevice ? 'large' : null} />
        }
        {!isMobileDevice ? t('buttons.search').toUpperCase() : null}
      </Button>
      <ButtonDayPicker
        label={t('filters.date-filter.presets.CUSTOM_DAY')}
        language={language}
        onDayChange={handleFromInputChange} />

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
    results={autocompleteResults}
    open={userInteracted && inputFocused && !!autocompleteResults.length}
    value={query}
    input={renderInput()}
    icon={<Icon link name="search" onClick={doSearch} />}
    showNoResults={false}
    loading={wip}
    onResultSelect={handleResultSelect}
  />;
};

export default withNamespaces()(OmniBox);

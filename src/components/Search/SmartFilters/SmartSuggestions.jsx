import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import { actions } from '../../../redux/modules/search';
import { searchGetQuerySelector, searchGetSmartSuggestionsSelector } from '../../../redux/selectors';
import useSmartChips from './useSmartChips';

/**
 * Uncertain recognitions on top of the search results: «Maybe "zohar": [Source: Rashbi › Zohar] [Topic: …] ✕».
 * Click applies the filter (and removes the word from the text), ✕ keeps the word as text.
 */
const SmartSuggestions = () => {
  const { t }     = useTranslation();
  const dispatch  = useDispatch();
  const groups    = useSelector(searchGetSmartSuggestionsSelector);
  const query     = useSelector(searchGetQuerySelector);
  const { chips } = useSmartChips();

  const showClearAll = chips.length > 1;
  if (!groups.length && !showClearAll) return null;

  const clearAll = () => {
    dispatch(actions.smartClearSuggestions());
    dispatch(actions.smartApplyFilters({ filters: {}, text: query || '' }));
  };

  const accept  = (mention, item) => dispatch(actions.smartAcceptSuggestion({ mention, item }));
  const dismiss = mention => dispatch(actions.smartRemoveSuggestion(mention));

  return (
    <div className="smart-suggestions flex flex-wrap items-start gap-x-3 gap-y-1 mb-[14px] text-[13px] text-black/60">
      {groups.map(({ mention, items }) => (
        <div key={mention} className="flex flex-wrap items-center gap-1">
          <span>{t('search.smart.maybe', { text: mention })}</span>
          {items.map(item => (
            <button
              key={`${item.slot}:${item.value}`}
              type="button"
              onClick={() => accept(mention, item)}
              className="rounded-full border border-dashed border-[#2185d0]/60 px-2 leading-[20px] text-[#134d78] hover:bg-[#e8f1fa] cursor-pointer"
            >
              <span className="text-black/60">{t(`filters.aside-filter.${item.name}`)}: </span>
              {item.path}
            </button>
          ))}
          <button
            type="button"
            aria-label={t('search.smart.dismiss')}
            title={t('search.smart.dismiss')}
            onClick={() => dismiss(mention)}
            className="material-symbols-outlined text-[16px]! leading-none! text-black/40 hover:text-black/70 cursor-pointer"
          >
            close
          </button>
        </div>
      ))}
      {showClearAll && (
        <button type="button" onClick={clearAll} className="ms-auto text-[#2185d0] hover:underline cursor-pointer">
          {t('search.smart.clearAll')}
        </button>
      )}
    </div>
  );
};

export default SmartSuggestions;

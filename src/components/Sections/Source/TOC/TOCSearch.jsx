import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { actions } from '../../../../redux/modules/textPage';
import { textPageGetTocInfoSelector } from '../../../../redux/selectors';

const TocSearch = () => {
  const { t } = useTranslation();

  const { match } = useSelector(textPageGetTocInfoSelector);

  const dispatch      = useDispatch();
  const handleChange  = e => search(e.target.value);
  const handleKeyDown = e => {
    if (e.keyCode === 27) { // Esc
      search('');
    }
  };

  const search = m => dispatch(actions.setTocMatch(m));

  return (
    <div className="toc_filter">
      <div className="toc_search relative">
        <input
          className="w-full border rounded pe-12! outline-none"
          placeholder={`${t('buttons.search')}...`}
          value={match}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
        />
        {!match && (
          // icon font sets direction:ltr on itself, so logical end-* would resolve to the right side in RTL
          <span className="material-symbols-outlined icon absolute top-0 ltr:right-0 rtl:left-0 w-12 h-full flex! items-center justify-center pointer-events-none">search</span>
        )}
      </div>
    </div>
  );
};

export default TocSearch;

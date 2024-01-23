import React from 'react';
import { Button, Input } from 'semantic-ui-react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { actions } from '../../../../redux/modules/textPage';
import { textPageGetTocInfoSelector } from '../../../../redux/selectors';

const TocSearch = () => {
  const { t } = useTranslation();

  const { match, sortByAZ } = useSelector(textPageGetTocInfoSelector);
  const dispatch            = useDispatch();
  const handleChange        = (e, data) => search(data.value);
  const handleKeyDown       = e => {
    if (e.keyCode === 27) { // Esc
      search('');
    }
  };

  const search = m => dispatch(actions.setTocMatch(m));
  const sortBy = () => dispatch(actions.setTocSortBy());

  return (
    <div className="source__toc_filter">
      <Input
        fluid
        size="mini"
        icon="search"
        className="source__toc_search"
        placeholder={t('sources-library.filter')}
        value={match}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
      />
      <div className="divider"></div>
      <Button
        compact
        size="small"
        className="source__toc_sort_btn"
        icon={
          <span className="material-symbols-outlined">
            sort_by_alpha
          </span>
        }
        color={sortByAZ ? 'blue' : 'grey'}
        active={sortByAZ}
        basic={!sortByAZ}
        onClick={sortBy}
      />
    </div>

  );
};

export default TocSearch;

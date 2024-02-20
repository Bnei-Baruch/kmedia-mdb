import React from 'react';
import { Input } from 'semantic-ui-react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { actions } from '../../../../redux/modules/textPage';
import { textPageGetTocInfoSelector } from '../../../../redux/selectors';

const TocSearch = () => {
  const { t } = useTranslation();

  const { match } = useSelector(textPageGetTocInfoSelector);

  const dispatch      = useDispatch();
  const handleChange  = (e, data) => search(data.value);
  const handleKeyDown = e => {
    if (e.keyCode === 27) { // Esc
      search('');
    }
  };

  const search = m => dispatch(actions.setTocMatch(m));

  return (
    <div className="toc_filter">
      <Input
        fluid
        size="mini"
        icon={!match ? 'search' : null}
        className="toc_search"
        placeholder={`${t('buttons.search')}...`}
        value={match}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
      />
    </div>

  );
};

export default TocSearch;

import { useDispatch, useSelector } from 'react-redux';
import { Checkbox, List } from 'semantic-ui-react';

import { actions, selectors as filters } from '../../../redux/modules/filters';
import { selectors as filtersAside } from '../../../redux/modules/filtersAside';
import { FN_LANGUAGES } from '../../../helpers/consts';
import { withNamespaces } from 'react-i18next';

const LanguageItem = ({ namespace, id, t }) => {

  const selected = useSelector(state => filters.getFilterByName(state.filters, namespace, FN_LANGUAGES))?.values || [];
  const stat     = useSelector(state => filtersAside.getStats(state.filtersAside, namespace, FN_LANGUAGES, id));

  const dispatch = useDispatch();

  const handleSelect = (e, { checked }) => {
    let val = [...selected].filter(x => x !== id);
    if (checked) {
      val.push(id);
    }

    dispatch(actions.setFilterValueMulti(namespace, FN_LANGUAGES, val));
  };

  return (
    <List.Item key={`${FN_LANGUAGES}_${id}`}>
      <List.Content className="stat" floated="right">
        {`(${stat})`}
      </List.Content>
      <Checkbox
        label={t(`constants.languages.${id}`)}
        checked={selected.includes(id)}
        onChange={handleSelect}
      />
    </List.Item>
  );
};

export default withNamespaces()(LanguageItem);

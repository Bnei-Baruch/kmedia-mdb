import { useMemo } from 'react';
import { withTranslation } from 'next-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Checkbox, List } from 'semantic-ui-react';
import { FN_MEDIA_TYPE } from '../../../helpers/consts';

import { actions, selectors as filters } from '../../../redux/modules/filters';
import { selectors as filtersAside } from '../../../redux/modules/filtersAside';

const MediaTypeItem = ({ namespace, id, t }) => {
  const selectedFilters = useSelector(state => filters.getFilterByName(state.filters, namespace, FN_MEDIA_TYPE));
  const selected        = useMemo(() => selectedFilters?.values || [], [selectedFilters]);
  const stat            = useSelector(state => filtersAside.getStats(state.filtersAside, namespace, FN_MEDIA_TYPE)(id));

  const dispatch = useDispatch();

  const handleSelect = (e, { checked }) => {
    const val = [...selected].filter(x => x !== id);
    if (checked) {
      val.push(id);
    }

    dispatch(actions.setFilterValueMulti(namespace, FN_MEDIA_TYPE, val));
  };

  return (
    <List.Item disabled={stat === 0}>
      <List.Content className="stat" floated="right">
        {`(${stat})`}
      </List.Content>
      <Checkbox
        label={t(`filters.media-types.${id}`)}
        checked={selected.includes(id)}
        onChange={handleSelect}
        disabled={stat === 0}
      />
    </List.Item>
  );
};

export default withTranslation()(MediaTypeItem);

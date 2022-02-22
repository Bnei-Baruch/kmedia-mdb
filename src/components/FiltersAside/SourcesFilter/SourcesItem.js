import { useDispatch, useSelector } from 'react-redux';
import { actions, selectors as filters } from '../../../redux/modules/filters';
import { selectors as sources } from '../../../redux/modules/sources';
import { selectors as filtersAside } from '../../../redux/modules/filtersAside';
import { FN_SOURCES_MULTI } from '../../../helpers/consts';
import { Checkbox, List } from 'semantic-ui-react';

const SourcesItem = ({ namespace, id, baseItems }) => {
  const selected = useSelector(state => filters.getFilterByName(state.filters, namespace, FN_SOURCES_MULTI))?.values || [];
  const stat     = useSelector(state => filtersAside.getStats(state.filtersAside, namespace, id));
  const getById  = useSelector(state => sources.getSourceById(state.sources));

  const item = getById(id);

  const dispatch = useDispatch();

  const handleSelect = (e, { checked }) => {
    let sel = [id, ...selected].filter(x => checked || id !== x);
    dispatch(actions.setFilterValueMulti(namespace, FN_SOURCES_MULTI, sel));
  };

  return (
    <List.Item>
      <Checkbox label={item.name} checked={selected.includes(id)} onChange={handleSelect} />
      <List.Content floated="right">
        {`(${stat})`}
      </List.Content>
      <List>
        {
          item.children?.filter(r => baseItems.includes(r))
            .map(x => <SourcesItem namespace={namespace} id={x} baseItems={baseItems} />)
        }

      </List>
    </List.Item>
  );
};

export default SourcesItem;

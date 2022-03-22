import { useDispatch, useSelector } from 'react-redux';
import { Button, Checkbox, List } from 'semantic-ui-react';

import { actions, selectors as filters } from '../../../redux/modules/filters';
import { selectors as sources } from '../../../redux/modules/sources';
import { selectors as tags } from '../../../redux/modules/tags';
import { selectors as filtersAside } from '../../../redux/modules/filtersAside';
import { FN_TOPICS_MULTI } from '../../../helpers/consts';
import { useEffect, useState } from 'react';

const TagSourceItem = ({ namespace, id, baseItems, filterName }) => {
  const [open, setOpen] = useState(false);

  const selected       = useSelector(state => filters.getFilterByName(state.filters, namespace, filterName))?.values || [];
  const stat           = useSelector(state => filtersAside.getStats(state.filtersAside, namespace, filterName, id));
  const getSourceById  = useSelector(state => sources.getSourceById(state.sources));
  const getPathSources = useSelector(state => sources.getPathByID(state.sources));
  const getTagById     = useSelector(state => tags.getTagById(state.tags));
  const getPathTags    = useSelector(state => tags.getPathByID(state.tags));

  const isTag   = filterName === FN_TOPICS_MULTI;
  const getPath = isTag ? getPathTags : getPathSources;
  const getById = isTag ? getTagById : getSourceById;
  const item    = getById(id);

  const pathIDs     = selected.length > 0 ? getPath(selected?.[0]).map(x => x.id) : [];
  const isOnSelPath = pathIDs.includes(id);
  const disabled    = !stat || selected.length > 0 && !isOnSelPath;

  const dispatch = useDispatch();

  useEffect(() => {
    if (isOnSelPath && !selected.includes(id))
      setOpen(true);
  }, [isOnSelPath]);

  const handleSelect = (e, { checked }) => {
    const val = checked ? id : null;
    dispatch(actions.setFilterValue(namespace, filterName, val));
  };

  return (
    <List.Item key={`${filterName}_${id}`} disabled={disabled}>
      <List.Content floated="right">
        {`(${stat})`}
      </List.Content>
      <Checkbox
        label={item[isTag ? 'label' : 'name']}
        checked={selected.includes(id)}
        disabled={disabled}
        onChange={handleSelect}
      />
      {
        (item.children?.length > 0) && (
          <Button
            basic
            className="clear_button no-shadow"
            icon={`caret ${!open ? 'left' : 'down'}`}
            onClick={() => setOpen(!open)}
          />
        )
      }
      <List>
        {
          open && item.children?.filter(r => baseItems.includes(r))
            .map(x => <TagSourceItem namespace={namespace} id={x} baseItems={baseItems} filterName={filterName} />)
        }

      </List>
    </List.Item>
  );
};

export default TagSourceItem;

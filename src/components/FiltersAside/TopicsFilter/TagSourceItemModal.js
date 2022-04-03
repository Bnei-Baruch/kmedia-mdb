import { Button, Card, Modal } from 'semantic-ui-react';
import { FN_TOPICS_MULTI } from '../../../helpers/consts';
import React, { useState } from 'react';
import { withNamespaces } from 'react-i18next';
import { useSelector } from 'react-redux';
import { selectors as settings } from '../../../redux/modules/settings';
import { getLanguageDirection } from '../../../helpers/i18n-utils';
import TagSourceItem from './TagSourceItem';
import SearchInput from '../../Filters/SearchInput';
import clsx from 'clsx';

const TagSourceItemModal = ({ namespace, baseItems, filterName, parent, open, onClose, getById, getPath, t }) => {

  const [query, setQuery] = useState('');

  const language = useSelector(state => settings.getLanguage(state.settings));

  if (!parent) return null;

  const handleSetQuery = (e, data) => setQuery(data.value);

  const dir   = getLanguageDirection(language);
  const isTag = filterName === FN_TOPICS_MULTI;
  const field = isTag ? 'label' : 'name';

  let children = parent.children?./*.filter(r => baseItems.includes(r)).*/map(getById);
  if (query) {
    const reg = new RegExp(query, 'i');
    children  = baseItems.filter(id => {
      return getPath(id).some(x => {
        return x.id === parent.id;
      });
    })
      .map(id => getById(id))
      .filter(x => x?.[field] && reg.test(x[field]));
  }
  const renderAsCard = item => {
    return (
      <Card className="tree_item_modal_content">
        <TagSourceItem
          namespace={namespace}
          id={item.id}
          baseItems={baseItems}
          filterName={filterName}
          deep={-1}
        />
      </Card>
    );
  };

  const chAsCard = children.filter(x => x?.children.length > 0);
  const chAsLeaf = children.filter(x => !(x?.children.length > 0));

  return (
    <Modal
      open={open}
      className={clsx('select_topic_modal', { [dir]: true })}
      size="large"
      dir={dir}
      onClose={onClose}
    >
      <Modal.Header className="no-border">
        {
          t('filters.aside-titles.modal', { name: parent[field] })
        }
        <SearchInput onSearch={handleSetQuery} onClear={() => setQuery(null)} defVal={query} />
      </Modal.Header>
      <Modal.Content>
        <Card.Group>
          {
            chAsLeaf.length > 0 && (
              <Card className="tree_item_modal_content item">
                {
                  chAsLeaf.map(x => (
                    <TagSourceItem
                      namespace={namespace}
                      id={x.id}
                      baseItems={baseItems}
                      filterName={filterName}
                      deep={-1}
                    />
                  ))
                }
              </Card>
            )
          }
          {
            chAsCard.map(renderAsCard)
          }
        </Card.Group>
      </Modal.Content>
      <Modal.Actions>
        <Button onClick={onClose} content={'close'} />
      </Modal.Actions>
    </Modal>
  );
};

export default withNamespaces()(TagSourceItemModal);

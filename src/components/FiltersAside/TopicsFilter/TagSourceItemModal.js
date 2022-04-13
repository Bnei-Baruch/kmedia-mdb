import { Button, Card, Icon, Input, Modal } from 'semantic-ui-react';
import { FN_TOPICS_MULTI } from '../../../helpers/consts';
import React, { useState } from 'react';
import { withNamespaces } from 'react-i18next';
import { useSelector } from 'react-redux';
import { selectors as settings } from '../../../redux/modules/settings';
import { getLanguageDirection } from '../../../helpers/i18n-utils';
import TagSourceItem from './TagSourceItem';
import clsx from 'clsx';

const TagSourceItemModal = props => {
  const {
    baseItems,
    filterName,
    parent,
    open,
    onClose,
    getById,
    getPath,
    t
  } = props;

  const [query, setQuery] = useState('');

  const language = useSelector(state => settings.getLanguage(state.settings));

  if (!parent) return null;

  const handleSetQuery = (e, data) => setQuery(data.value);

  const dir   = getLanguageDirection(language);
  const isTag = filterName === FN_TOPICS_MULTI;
  const field = isTag ? 'label' : 'name';

  let children = parent.children?.filter(r => baseItems.includes(r)).map(getById);
  if (query) {
    const reg = new RegExp(query, 'i');
    children  = baseItems.filter(id => id !== parent.id && getPath(id).some(x => x.id === parent.id))
      .map(id => getById(id))
      .filter(x => x?.[field] && reg.test(x[field]));
  }

  const renderAsCard = item => (
    <Card className="tree_item_modal_content">
      <TagSourceItem {...props} id={item.id} deep={-1} />
    </Card>
  );

  const chAsCard = children.filter(x => x?.children.length > 0);
  const chAsLeaf = children.filter(x => !(x?.children.length > 0));

  return (
    <Modal
      open={open}
      className={clsx('filters_aside_tree_modal', { [dir]: true })}
      size="large"
      dir={dir}
      onClose={onClose}
      closeIcon={<Icon name="times circle outline" />}
    >
      <Modal.Header className="no-border">
        {parent[field]}
        <Input
          className="search-input"
          placeholder={t('filters.aside-filter.search-input')}
          onChange={handleSetQuery}
          value={query}
        />
      </Modal.Header>
      <Modal.Content scrolling>
        <Card.Group itemsPerRow={3}>
          {
            chAsLeaf.length > 0 && (chAsLeaf.map(x => (
              <Card className="tree_item_modal_content item single_item">
                <TagSourceItem {...props} id={x.id} deep={-1} />
              </Card>
            ))
            )
          }
          {
            chAsCard.map(renderAsCard)
          }
        </Card.Group>
      </Modal.Content>
      <Modal.Actions>
        <Button primary content={t('buttons.close')} onClick={onClose} />
      </Modal.Actions>
    </Modal>
  );
};

export default withNamespaces()(TagSourceItemModal);

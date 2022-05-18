import React, { useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { withNamespaces } from 'react-i18next';
import { Button } from 'semantic-ui-react';

import { selectors } from '../../../redux/modules/filtersAside';
import { FN_COLLECTION_MULTI} from '../../../helpers/consts';
import FilterHeader from '../FilterHeader';
import CollectionItem from './CollectionItem';
import CollectionsModal from './CollectionsModal';
import { selectors as mdb } from '../../../redux/modules/mdb';

const MAX_SHOWED_ITEMS = 5;

const Collections = ({ namespace, ctOnly = null, t }) => {
  const [showAll, setShowAll] = useState(false);

  const ids     = useSelector(state => selectors.getTree(state.filtersAside, namespace, FN_COLLECTION_MULTI));
  const getById = useSelector(state => mdb.nestedGetCollectionById(state.mdb));

  const itemsMemo = useMemo(() => ids.map(getById).filter(x => !!x), [ids]);
  const items     = itemsMemo.filter(x => !ctOnly || ctOnly.includes(x.content_type));

  if (!(items?.length > 0)) return null;

  const toggleShowAll = () => setShowAll(!showAll);

  return (
    <FilterHeader
      filterName={FN_COLLECTION_MULTI}
      children={
        <>
          {
            items.slice(0, MAX_SHOWED_ITEMS).map(x => <CollectionItem namespace={namespace} item={x} key={x.id} />)
          } {
          items.length > MAX_SHOWED_ITEMS && (
            <>
              <Button
                basic
                icon="plus"
                color="blue"
                className="clear_button"
                content={t('topics.show-more')}
                onClick={toggleShowAll}
              />
              <CollectionsModal
                items={items}
                open={showAll}
                onClose={toggleShowAll}
                namespace={namespace}
              />
            </>
          )
        }
        </>
      }
    />
  );
};

export default withNamespaces()(Collections);

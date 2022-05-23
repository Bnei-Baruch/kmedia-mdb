import React, { useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { withNamespaces } from 'react-i18next';
import { Button } from 'semantic-ui-react';
import { isLanguageRtl } from '../../../helpers/i18n-utils';

import { FN_COLLECTION_MULTI, FN_CONTENT_TYPE, FN_TOPICS_MULTI, UNIT_PROGRAMS_TYPE } from '../../../helpers/consts';
import { selectors as filters } from '../../../redux/modules/filters';
import { selectors } from '../../../redux/modules/filtersAside';
import { selectors as mdb } from '../../../redux/modules/mdb';
import { selectors as settings } from '../../../redux/modules/settings';
import ContentTypeItem from '../../FiltersAside/ContentTypeFilter/ContentTypeItem';
import FilterHeader from '../../FiltersAside/FilterHeader';
import CollectionsModal, { cCtByUnitCt } from './CollectionsModal';

const CollectionsFilter = ({ namespace, t }) => {
  const [showCByCT, setShowCByCT] = useState('');

  const language = useSelector(state => settings.getLanguage(state.settings));
  const ids      = useSelector(state => selectors.getTree(state.filtersAside, namespace, FN_COLLECTION_MULTI));
  const getById  = useSelector(state => mdb.nestedGetCollectionById(state.mdb));
  const selected = useSelector(state => filters.getFilterByName(state.filters, namespace, FN_COLLECTION_MULTI))?.values || [];

  const itemsMemo = useMemo(() => ids.map(getById).filter(x => !!x), [ids]);
  const items     = itemsMemo.filter(x => cCtByUnitCt[showCByCT] === x.content_type);

  return (<>
    <CollectionsModal
      namespace={namespace}
      items={items}
      open={!!showCByCT}
      onClose={() => setShowCByCT('')}
    />
    <FilterHeader
      filterName={FN_CONTENT_TYPE}
      children={UNIT_PROGRAMS_TYPE.map(id => (<ContentTypeItem
        namespace={namespace}
        id={id}
        key={id}
        isSelChild={selected.map(getById).some(c => c.content_type === cCtByUnitCt[id])}
        action={<Button
          basic
          color="blue"
          className="clear_button no-shadow"
          icon={`caret ${isLanguageRtl(language) ? 'left' : 'right'}`}
          onClick={() => setShowCByCT(id)}
          size="medium"
        />}
      />))}
    />
  </>);
};

export default withNamespaces()(CollectionsFilter);

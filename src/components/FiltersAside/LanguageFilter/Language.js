import React from 'react';
import { useSelector } from 'react-redux';
import { selectors } from '../../../redux/modules/filtersAside';
import { withNamespaces } from 'react-i18next';
import { FN_LANGUAGES } from '../../../helpers/consts';
import { List } from 'semantic-ui-react';
import LanguageItem from './LanguageItem';

const Language = ({ namespace, t }) => {
  const items = useSelector(state => selectors.getTree(state.filtersAside, namespace, FN_LANGUAGES));

  return (
    <List>
      <List.Header content={t(`topic.title.${FN_LANGUAGES}`)} />
      {
        items.map(id => <LanguageItem namespace={namespace} id={id} />)
      }
    </List>
  );
};

export default withNamespaces()(Language);

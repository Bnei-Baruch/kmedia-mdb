import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Container, Icon, Label } from 'semantic-ui-react';
import { actions, selectors as filters } from '../../redux/modules/filters';
import { withNamespaces } from 'react-i18next';

const FilterLabels = ({ namespace, t }) => {
  const list = useSelector(state => filters.getFilters(state.filters, namespace));

  const dispatch = useDispatch();

  const onRemove = fn => {
    dispatch(actions.setFilterValue(namespace, fn, null));
  };

  const renderItem = ({ name, values }) => {
    const val = t(values[0]);
    const n   = t(name);
    return (
      <Label
        basic
        circular
        size="tiny"
      >
        {`${n}: ${val}`}
        <Icon name="times circle outline" className="margin-right-4 margin-left-4" onClick={() => onRemove(name)} />
      </Label>
    );
  };

  return (
    <Container>
      {
        list.filter(f => f.values?.length > 0).map(renderItem)
      }
    </Container>
  );
};

export default withNamespaces()(FilterLabels);

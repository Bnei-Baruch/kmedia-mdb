import React from 'react';
import { withTranslation } from 'next-i18next';
import { useSelector } from 'react-redux';
import { Container, Icon, Label } from 'semantic-ui-react';
import { FN_DATE_FILTER } from '../../../src/helpers/consts';
import { selectors as filters } from '../../redux/slices/filterSlice/filterSlice';
import { definitionsByName } from '../transformer';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/router';

const FilterLabels = ({ namespace, t }) => {
  const list = useSelector(state => filters.getFilters(state.filters, namespace)) || [];


  const searchParams = useSearchParams();
  const router       = useRouter();

  const titleByFilterType = (fn, val) => {
    console.log('FilterLabels rerender bug titleByFilterType', fn, val);
    const Title = definitionsByName[fn];
    return <Title value={val} />;
  };

  const onRemove = (name, id) => {
    if (name !== FN_DATE_FILTER) {
      const _params = new URLSearchParams(searchParams);
      _params.delete(id);
      router.push({ query: _params.toString() });
    }
  };

  const renderItem = (name, val, key) => (
    <Label
      basic
      circular
      size="tiny"
      key={key}
    >
      {
        titleByFilterType(name, val)
      }
      <Icon name="times circle outline" size="large" inverted circular onClick={() => onRemove(name, val)} />
    </Label>
  );

  return (
    <Container className="filter_aside_labels">
      <span>{t('filters.filters')}:</span>
      {
        list.filter(f => f.values?.length > 0).flatMap((f, j) =>
          f.values.map((v, i) => renderItem(f.name, v, `${j}_${i}`))
        )
      }
    </Container>
  );
};

export default withTranslation()(FilterLabels);

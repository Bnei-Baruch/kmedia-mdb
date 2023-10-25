'use client';
import React from 'react';
import { useTranslation } from 'next-i18next';
import { Container, Header } from 'semantic-ui-react';
import { PAGE_NS_BLOG } from '../../../helpers/consts';
import DateFilter from '../../../../lib/filters/components/DateFilter';

const Filters = ({namespace}) => {
  const { t } = useTranslation();
  return (
    <Container className="padded">
      <Header as="h3" content={t('filters.aside-filter.filters-title')} />
      <DateFilter namespace={namespace}  />
    </Container>
  );
};

export default Filters;

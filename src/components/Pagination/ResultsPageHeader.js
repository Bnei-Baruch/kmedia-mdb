import React from 'react';
import PropTypes from 'prop-types';
import { withTranslation, useTranslation } from 'next-i18next';
import { Container } from 'semantic-ui-react';
import { useSearchParams } from 'next/navigation';

const ResultsPageHeader = ({ pageSize, total }) => {
  let content;
  const searchParams = useSearchParams();
  const { t }        = useTranslation();

  if (total === 0) {
    content = t('messages.no-results');
  } else if (total <= pageSize) {
    content = t('messages.pagination-results', { start: 1, end: total, total });
  } else {
    const pageNo = searchParams.get('page_no') || 1;
    content      = t('messages.pagination-results', {
      start: ((pageNo - 1) * pageSize) + 1,
      end: Math.min(total, pageNo * pageSize),
      total,
    });
  }

  return <Container className="padded" content={content} />;
};

ResultsPageHeader.propTypes = {
  pageSize: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired,
};

export default ResultsPageHeader;

import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { Container } from 'semantic-ui-react';

const ResultsPageHeader = ({ pageNo, pageSize, total }) => {
  const { t } = useTranslation('common', { useSuspense: false });

  let content;

  if (total === 0) {
    content = t('messages.no-results');
  } else if (total <= pageSize) {
    content = t('messages.pagination-results', { start: 1, end: total, total });
  } else {
    content = t('messages.pagination-results',
      {
        start: ((pageNo - 1) * pageSize) + 1,
        end: Math.min(total, pageNo * pageSize),
        total,
      }
    );
  }

  return <Container className="pagination-results" content={content} />;
};

ResultsPageHeader.propTypes = {
  pageNo: PropTypes.number.isRequired,
  pageSize: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired,
};

export default ResultsPageHeader;

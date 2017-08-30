import React from 'react';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';
import { Header } from 'semantic-ui-react';

const ResultsPageHeader = (props) => {
  const { pageNo, pageSize, total, t } = props;

  if (total === 0) {
    return <Header as="h2" content={t('messages.no-results')} />;
  }

  if (total <= pageSize) {
    return (
      <Header
        as="h2"
        content={t('messages.pagination-results', { start: 1, end: total, total })}
      />
    );
  }

  return (
    <Header
      as="h2"
      content={
        t('messages.pagination-results',
          {
            start: ((pageNo - 1) * pageSize) + 1,
            end: Math.min(total, pageNo * pageSize),
            total,
          }
        )
      }
    />
  );
};

ResultsPageHeader.propTypes = {
  pageNo: PropTypes.number.isRequired,
  pageSize: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired,
  t: PropTypes.func.isRequired,
};

ResultsPageHeader.defaultProps = {};

export default translate()(ResultsPageHeader);

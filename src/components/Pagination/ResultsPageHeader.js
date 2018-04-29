import React from 'react';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';
import { Header } from 'semantic-ui-react';

const ResultsPageHeader = (props) => {
  const { pageNo, pageSize, total, t } = props;

  let content;

  if (total === 0) {
    content = t('messages.no-results');
  } else if (total <= pageSize) {
    content = t('messages.pagination-results', { start: 1, end: total, total });
  } else {
    content =
      t('messages.pagination-results',
        {
          start: ((pageNo - 1) * pageSize) + 1,
          end: Math.min(total, pageNo * pageSize),
          total,
        }
      );
  }

  return <Header as="h2" className="pagination-results" content={content} />;
};

ResultsPageHeader.propTypes = {
  pageNo: PropTypes.number.isRequired,
  pageSize: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired,
  t: PropTypes.func.isRequired,
};

ResultsPageHeader.defaultProps = {};

export default translate()(ResultsPageHeader);

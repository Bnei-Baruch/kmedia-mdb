import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

const DidYouMean = ({ typo_suggest }) => {
  const { t } = useTranslation();
  if (!typo_suggest) {
    return null;
  }

  const to            = `?q=${typo_suggest}`;
  const didYouMeanStr = t('search.didYouMean');

  return (
    <div className=" px-4 search__didyoumean">
      {didYouMeanStr}
      <a href={to} className="search__link">{typo_suggest}</a>
    </div>
  );
};

DidYouMean.propTypes = {
  typo_suggest: PropTypes.string.isRequired,
};

export default DidYouMean;

import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { Container } from 'semantic-ui-react';

const DidYouMean = ({ typo_suggest }) => {
  const { t } = useTranslation('common', { useSuspense: false });

  if (!typo_suggest) {
    return null;
  }

  const to            = `?q=${typo_suggest}`;
  const didYouMeanStr = t('search.didYouMean');

  return (
    <Container className="search__didyoumean">
      {didYouMeanStr}
      <a href={to} className="search__link">{typo_suggest}</a>
    </Container>
  );
};

DidYouMean.propTypes = {
  typo_suggest: PropTypes.string.isRequired,
};

export default DidYouMean;

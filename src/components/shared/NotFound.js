import React from 'react';
import { Container } from 'semantic-ui-react';
import { useTranslation } from 'react-i18next';

const NotFound = () => {
  const { t } = useTranslation();
  return (
    <Container
      fluid
      className="padded"
      textAlign="center"
      content={t('messages.not-found')}
    />
  );
};

export default NotFound;

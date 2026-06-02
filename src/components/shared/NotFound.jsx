import React from 'react';
import { useTranslation } from 'react-i18next';

const NotFound = ({ textKey }) => {
  const { t } = useTranslation();

  return (
    <div className="w-full p-4 text-center"    >
      {t(textKey || 'messages.not-found')}
    </div>
  );
};

export default NotFound;

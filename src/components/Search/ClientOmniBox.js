import React, { useEffect, useState } from 'react';
import OmniBox from './OmniBox';

const ClientOmniBox = ({ isHomePage = false }) => {
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);
  if (!isClient) return null;

  return <OmniBox isHomePage={isHomePage} />;
};

export default ClientOmniBox;

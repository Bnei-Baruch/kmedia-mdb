import React from 'react';
import { Icon } from 'semantic-ui-react';
import { usePreloader } from '../../../pkg/jwpAdapter';

const Preloader = () => {
  const loaded = usePreloader();

  if (loaded === true) return null;

  return (
    <>
      {loaded?.toString()}
      <Icon name="circle notch" loading />
    </>
  );
};

export default Preloader;

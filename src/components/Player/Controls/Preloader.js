import React from 'react';
import { usePreloader } from '../../../pkg/jwpAdapter';

const Preloader = () => {
  const loaded = usePreloader();

  if (loaded === true) return null;

  return (
    <div className="preloader">
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
  );
};

export default Preloader;

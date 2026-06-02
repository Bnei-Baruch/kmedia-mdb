import React from 'react';
import { useSelector } from 'react-redux';
import { playerIsLoadedSelector } from '../../../redux/selectors';

const Preloader = () => {
  const loaded = useSelector(playerIsLoadedSelector);

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

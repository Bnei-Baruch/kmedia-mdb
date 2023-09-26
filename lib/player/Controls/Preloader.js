import React from 'react';
import { useSelector } from 'react-redux';
import { selectors } from '../../redux/slices/playerSlice/playerSlice';

const Preloader = () => {
  const loaded = useSelector(state => selectors.isLoaded(state.player));

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

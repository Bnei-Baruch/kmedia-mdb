import React from 'react';
import Template, { GetTempUnitIds } from './Template';

const Playlists = () => {
  const latestUnits = GetTempUnitIds();

  return (
    <Template units={latestUnits} title={"Playlists"} />
  )
}

export default Playlists;

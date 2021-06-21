import React from 'react';
import Template, { GetTempUnitIds } from './Template';

const Liked = () => {
  const latestUnits = GetTempUnitIds();

  return (
    <Template units={latestUnits} title={"Liked"} rowsNumber={1} />
  )
}

export default Liked;

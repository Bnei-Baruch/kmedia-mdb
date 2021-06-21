import React from 'react';
import Template, { GetTempUnitIds } from './Template';

const Subscriptions = () => {
  const latestUnits = GetTempUnitIds();

  return (
    <Template units={latestUnits} title={"Subscriptions"} rowsNumber={3} />
  )
}

export default Subscriptions;

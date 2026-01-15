import React from 'react';

const PlayerContainerClient = React.lazy(() => import('./PlayerContainerClient'));

export default function PlayerContainer(props) {
  console.log('PlayerContainer', import.meta.env);
  if (import.meta.env.SSR) {
    return <div className="player" dir="ltr"></div>;
  }

  return (
    <React.Suspense fallback={null}>
      <PlayerContainerClient {...props} />
    </React.Suspense>
  );
}

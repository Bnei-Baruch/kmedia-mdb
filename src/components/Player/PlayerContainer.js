import React from 'react';

const PlayerContainerClient = React.lazy(() => import('./PlayerContainerClient'));

export default function PlayerContainer(props) {
  console.log('PlayerContainer', typeof window === 'undefined' ? 'SSR' : 'Client');
  if (typeof window === 'undefined') {
    return <div className="player" dir="ltr"></div>;
  }

  return (
    <React.Suspense fallback={null}>
      <PlayerContainerClient {...props} />
    </React.Suspense>
  );
}

import React, { useSyncExternalStore } from 'react';

const PlayerContainerClient = React.lazy(() => import('./PlayerContainerClient'));

export default function PlayerContainer(props) {
  const isClient = useSyncExternalStore(() => () => {}, () => true, () => false);

  if (!isClient) {
    return <div className="player" dir="ltr"></div>;
  }

  return (
    <React.Suspense fallback={null}>
      <PlayerContainerClient {...props} />
    </React.Suspense>
  );
}

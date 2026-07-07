import { lazy, Suspense, useSyncExternalStore } from 'react';

const PlayerContainerClient = lazy(() => import('./PlayerContainerClient'));

export default function PlayerContainer(props) {
  const isClient = useSyncExternalStore(() => () => {}, () => true, () => false);

  if (!isClient) {
    return <div className="player" dir="ltr"></div>;
  }

  return (
    <Suspense fallback={null}>
      <PlayerContainerClient {...props} />
    </Suspense>
  );
}

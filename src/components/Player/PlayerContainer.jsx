import { lazy, Suspense, useContext, useSyncExternalStore } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { DeviceInfoContext } from '../../helpers/app-contexts';
import { assetUrl } from '../../helpers/Api';
import { mdbGetDenormContentUnitSelector, playlistGetInfoSelector } from '../../redux/selectors';

const PlayerContainerClient = lazy(() => import('./PlayerContainerClient'));

// Unit whose poster the player will show: the built playlist's unit (collection pages build it in SSR),
// else the unit of a /cu/:id or /:id/cu/:cuId page — only if it is a loaded unit (/playlists/:id is not).
const usePosterUnitId = () => {
  const { cuId: playlistCuId } = useSelector(playlistGetInfoSelector) || {};
  const params                 = useParams();
  const routeCuId              = params.cuId || params.id;
  const routeUnit              = useSelector(state => routeCuId && mdbGetDenormContentUnitSelector(state, routeCuId));
  return playlistCuId || (routeUnit ? routeCuId : null);
};

// The player is client-only. Reserve its box (16:9 for video and audio alike, +16px of controls on mobile)
// so the page doesn't jump by the player's height when it mounts, and show the same poster the player will
// show (assetUrl api/thumbnail, as in playableItem) right from the SSR html: it is the LCP element of unit pages.
const PlayerPlaceholderView = ({ isMobile, posterUnitId }) => (
  <div className="player" dir="ltr">
    <div className="aspect-video bg-black">
      {posterUnitId && (
        <img
          src={assetUrl(`api/thumbnail/${posterUnitId}`)}
          alt=""
          fetchPriority="high"
          className="w-full h-full object-contain"
        />
      )}
    </div>
    {isMobile && <div className="h-4 bg-black" />}
  </div>
);

// Also shown by pages while the playlist is being built (the player is rendered only once it is ready).
export const PlayerPlaceholder = () => {
  const { isMobile } = useContext(DeviceInfoContext);
  const posterUnitId = usePosterUnitId();
  return <PlayerPlaceholderView isMobile={isMobile} posterUnitId={posterUnitId} />;
};

export default function PlayerContainer(props) {
  const isClient = useSyncExternalStore(() => () => {}, () => true, () => false);

  const placeholder = <PlayerPlaceholder />;
  if (!isClient) {
    return placeholder;
  }

  return (
    <Suspense fallback={placeholder}>
      <PlayerContainerClient {...props} />
    </Suspense>
  );
}

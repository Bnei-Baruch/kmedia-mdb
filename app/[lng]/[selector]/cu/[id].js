import React from 'react';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { wrapper } from '../../../../lib/redux';
import { COLLECTION_DAILY_LESSONS, CT_VIRTUAL_LESSONS } from '../../../../src/helpers/consts';
import { fetchUnit, fetchSQData } from '../../../../lib/redux/slices/mdbSlice';
import { buildPlaylist, buildSingleMedia } from '../../../../lib/redux/slices/playlistSlice/thunks';
import PlaylistPage from '../../../../src/components/Pages/WithPlayer/Playlist/PlaylistPage';
import PlayerContainer from '../../../../lib/player/PlayerContainer';
import SingleMediaPage from '../../../../src/components/Pages/WithPlayer/SingleMedia/SingleMediaPage';

const cts                       = [...COLLECTION_DAILY_LESSONS, CT_VIRTUAL_LESSONS];
export const getServerSideProps = wrapper.getServerSideProps(store => async (context) => {
  const lang = context.locale ?? 'en';
  await store.dispatch(fetchSQData());
  let cId    = context.query.c;
  const cuId = context.params.id;
  if (!cId) {
    const { data: unit } = await store.dispatch(fetchUnit(cuId)).unwrap();
    const cs             = Object.values(unit.collections || {});
    cId                  = cs.find(c => cts.includes(c.content_type))?.id;
  }
  if (cId) {
    await store.dispatch(buildPlaylist({ cId, cuId, query: context.query }));
  } else {
    await store.dispatch(buildSingleMedia({ cuId, query: context.query }));
  }

  const _i18n = await serverSideTranslations(lang);
  return { props: { ..._i18n, embed: context.query.embed ?? false, isSingleMedia: !cId } };
});

const PlayerPage = ({ embed, isSingleMedia }) => {
  const playerContainer = <PlayerContainer />;

  if (embed) return playerContainer;

  if (isSingleMedia)
    return <SingleMediaPage playerContainer={playerContainer} />;

  return <PlaylistPage playerContainer={playerContainer} />;
};
export default PlayerPage;

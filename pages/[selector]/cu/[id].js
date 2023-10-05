import React from 'react';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { wrapper } from '../../../lib/redux';
import { actions as mdbActions } from '../../../lib/redux/slices/mdbSlice/mdbSlice';
import { COLLECTION_DAILY_LESSONS, CT_VIRTUAL_LESSONS } from '../../../src/helpers/consts';
import { actions } from '../../../lib/redux/slices/playlistSlice/playlistSlice';
import { fetchUnit, fetchCollection, fetchCollections, fetchSQData } from '../../../lib/redux/slices/mdbSlice';
import { buildPlaylist } from '../../../lib/redux/slices/playlistSlice/thunks';
import PlaylistPage from '../../../src/components/Pages/WithPlayer/Playlist/PlaylistPage';
import PlayerContainer from '../../../lib/Player/PlayerContainer';

const cts                       = [...COLLECTION_DAILY_LESSONS, CT_VIRTUAL_LESSONS];
export const getServerSideProps = wrapper.getServerSideProps(store => async (context) => {
  const lang = context.locale ?? 'en';
  await store.dispatch(fetchSQData());
  let cId    = context.query.c;
  const cuId = context.params.id;
  if (!cId) {
    const { data: unit } = await store.dispatch(fetchUnit(cuId)).unwrap();
    const cs             = Object.values(unit.collections) || [];
    cId                  = cs.find(c => cts.includes(c.content_type))?.id;
  }
  await store.dispatch(buildPlaylist({ cId, cuId, query: context.query }));

  const _i18n = await serverSideTranslations(lang);
  return { props: { ..._i18n, embed: context.query.embed ?? false } };
});

const PlayerPage = ({ embed }) => {
  const playerContainer = <PlayerContainer />;

  if (embed) return playerContainer;
  return (
    <PlaylistPage playerContainer={playerContainer} />
  );
};
export default PlayerPage;

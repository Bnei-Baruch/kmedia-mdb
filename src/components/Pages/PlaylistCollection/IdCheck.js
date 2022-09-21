import React from 'react';
import { useParams } from 'react-router-dom';
import PropTypes from 'prop-types';
import PlaylistContainer from '../WithPlayer/Playlist/PlaylistContainer';

const PlaylistCollectionIdCheck = ({ colId = undefined }) => {
  const { id } = useParams();

  // use input Id if given
  const cId = colId || id;

  return <PlaylistCollectionPage />;
};

PlaylistCollectionIdCheck.propTypes = {
  colId: PropTypes.string
};

export default PlaylistCollectionIdCheck;

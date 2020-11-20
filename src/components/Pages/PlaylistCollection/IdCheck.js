import { useParams } from 'react-router-dom';
import PropTypes from 'prop-types';
import PlaylistCollectionContainer from './Container';

const PlaylistCollectionIdCheck = ({ colId = undefined }) => {
  const { id } = useParams();

  // use input Id if given
  const cId = colId || id;

  return <PlaylistCollectionContainer cId={cId} />
}

PlaylistCollectionIdCheck.propTypes = {
  colId: PropTypes.string
};

export default PlaylistCollectionIdCheck;
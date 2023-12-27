import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectors as textPage, actions } from '../../../../redux/modules/textPage';
import { useParams } from 'react-router-dom';
import { selectors as sourcesSelectors, selectors } from '../../../../redux/modules/sources';
import { firstLeafId } from '../helper';

export const useTextSubject = () => {
  let { id }          = useParams();
  const subjectId     = useSelector(state => textPage.getSubject(state.textPage).id);
  const { wip, err }  = useSelector(state => textPage.getWipErr(state.textPage));
  const getSourceById = useSelector(state => selectors.getSourceById(state.sources));

  const dispatch = useDispatch();

  id              = firstLeafId(id, getSourceById);
  const needFetch = subjectId !== id && !wip && !err;
  useEffect(() => {
    needFetch && dispatch(actions.fetchSubject(id));
  }, [id, needFetch]);

  return null;
};


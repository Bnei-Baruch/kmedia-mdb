import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { actions } from '../../../../redux/modules/textPage';
import { useParams } from 'react-router-dom';
import { selectors } from '../../../../redux/modules/sources';
import { firstLeafId } from '../helper';
import { textPageGetSubjectSelector, textPageGetWipErrSelector } from '../../../../redux/selectors';

export const useTextSubject = propId => {
  let { id } = useParams();
  id         = propId ?? id;

  const { id: subjectId } = useSelector(textPageGetSubjectSelector);
  const { wip, err }      = useSelector(textPageGetWipErrSelector);
  const getSourceById     = useSelector(state => selectors.getSourceById(state.sources));

  const dispatch = useDispatch();

  id              = firstLeafId(id, getSourceById);
  const needFetch = subjectId !== id && !wip && !err;
  useEffect(() => {
    needFetch && dispatch(actions.fetchSubject(id));
  }, [id, needFetch]);

  return subjectId !== id || wip;
};


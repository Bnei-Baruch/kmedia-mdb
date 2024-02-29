import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { actions } from '../../../../redux/modules/textPage';
import { useParams } from 'react-router-dom';
import { firstLeafId, checkRabashGroupArticles } from '../helper';
import {
  textPageGetSubjectSelector,
  textPageGetWipErrSelector,
  sourcesGetSourceByIdSelector
} from '../../../../redux/selectors';

export const useTextSubject = propId => {
  let { id } = useParams();

  id = propId ?? id;

  const { id: subjectId } = useSelector(textPageGetSubjectSelector);
  const { wip, err }      = useSelector(textPageGetWipErrSelector);
  const getSourceById     = useSelector(sourcesGetSourceByIdSelector);

  const dispatch = useDispatch();

  id              = firstLeafId(id, getSourceById);
  const fixedId   = checkRabashGroupArticles(id).uid;
  const needFetch = subjectId !== fixedId && !wip && !err;

  useEffect(() => {
    needFetch && dispatch(actions.fetchSubject(id));
  }, [id, needFetch, dispatch]);

  return subjectId !== fixedId || wip;
};


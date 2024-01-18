import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectors as textPage, actions } from '../../../../redux/modules/textPage';
import { useParams } from 'react-router-dom';
import { textPageGetUrlInfoSelector } from '../../../../redux/selectors';

export const useInitTextUrl = () => {
  const { url }  = useSelector(textPageGetUrlInfoSelector);
  const dispatch = useDispatch();

  useEffect(() => {
    !url && dispatch(actions.setUrlPath());
  }, [url]);

  return null;
};


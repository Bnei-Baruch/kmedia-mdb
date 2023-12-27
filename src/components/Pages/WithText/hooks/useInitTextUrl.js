import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectors as textPage, actions } from '../../../../redux/modules/textPage';
import { useParams } from 'react-router-dom';

export const useInitTextUrl = () => {
  const { url }  = useSelector(state => textPage.getUrlInfo(state.textPage));
  const dispatch = useDispatch();

  useEffect(() => {
    !url && dispatch(actions.setUrlPath());
  }, [url]);

  return null;
};


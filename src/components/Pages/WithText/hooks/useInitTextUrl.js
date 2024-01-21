import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { actions } from '../../../../redux/modules/textPage';
import { textPageGetUrlInfoSelector } from '../../../../redux/selectors';

export const useInitTextUrl = urlProps => {
  const { url }  = useSelector(textPageGetUrlInfoSelector);
  const dispatch = useDispatch();

  useEffect(() => {
    !url && dispatch(actions.setUrlInfo(urlProps));
    return () => {
      dispatch(actions.setUrlInfo(urlProps));
    };
  }, [url, urlProps]);

  return null;
};


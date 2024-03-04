import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { actions } from '../../../../redux/modules/textPage';

export const useInitTextUrl = (urlProps, clearUrlProps) => {
  const dispatch = useDispatch();

  useEffect(() => {
    if (clearUrlProps) {
      dispatch(actions.setUrlInfo());
    } else if (urlProps) {
      dispatch(actions.setUrlInfo(urlProps));
    }
  }, [urlProps, clearUrlProps, dispatch]);

  return null;
};


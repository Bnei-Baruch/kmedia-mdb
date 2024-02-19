import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { actions } from '../../../../redux/modules/textPage';

export const useInitTextUrl = (urlProps, clearUrlProps) => {
  const dispatch = useDispatch();

  useEffect(() => {
    if (clearUrlProps) {
      console.log('share bug: useInitTextUrl clear');
      dispatch(actions.setUrlInfo());
    } else if (urlProps) {
      console.log('share bug: useInitTextUrl', urlProps);
      dispatch(actions.setUrlInfo(urlProps));
    }
  }, [urlProps, clearUrlProps, dispatch]);

  return null;
};


import { useEffect, useContext } from 'react';
import { useDispatch } from 'react-redux';
import { actions } from '../../../../redux/modules/textPage';
import { DeviceInfoContext } from '../../../../helpers/app-contexts';

let lastScrollTop              = 0;
export const useScrollBehavior = ref => {

  const { isMobileDevice } = useContext(DeviceInfoContext);
  const dispatch           = useDispatch();
  useEffect(() => {
    const handleScroll = () => {
      const st = window.pageYOffset || document.documentElement.scrollTop;

      if (st < ref.current?.offsetTop + 60) {
        dispatch(actions.setScrollDir(0));
      } else if (st + document.documentElement.offsetHeight >= ref.current?.scrollHeight) {
        dispatch(actions.setScrollDir(2));
      } else if (st > lastScrollTop) {
        dispatch(actions.setScrollDir(1));
      } else if (st + 5 < lastScrollTop) {
        dispatch(actions.setScrollDir(-1));
      }

      lastScrollTop = st <= 0 ? 0 : st;
    };

    window.addEventListener('scroll', handleScroll);

    return () => window.removeEventListener('scroll', handleScroll);
  }, [ref.current, isMobileDevice, dispatch]);

  return null;
};


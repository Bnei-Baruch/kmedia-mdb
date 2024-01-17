import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectors as textPage, actions } from '../../../../redux/modules/textPage';
import { useParams } from 'react-router-dom';
import { selectors as sourcesSelectors, selectors } from '../../../../redux/modules/sources';
import { firstLeafId } from '../helper';

let lastScrollTop              = 0;
export const useScrollBehavior = ref => {

  const dispatch = useDispatch();
  useEffect(() => {
    const handleScroll = () => {
      const st = window.pageYOffset || document.documentElement.scrollTop;
      if (st < ref.current?.offsetTop + 60) {
        dispatch(actions.setScrollDir(0));
      } else if (st > lastScrollTop) {
        dispatch(actions.setScrollDir(1));
      } else if (st + 5 < lastScrollTop) {
        dispatch(actions.setScrollDir(-1));
      }

      lastScrollTop = st <= 0 ? 0 : st;
    };

    window.addEventListener('scroll', handleScroll);

    return () => window.removeEventListener('scroll', handleScroll);
  }, [ref.current]);

  return null;
};


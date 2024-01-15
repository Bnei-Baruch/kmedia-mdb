import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectors as textPage, actions as textActions } from '../../../../redux/modules/textPage';
import { selectors as assets, actions } from '../../../../redux/modules/assets';
import WipErr from '../../../shared/WipErr/WipErr';
import { useTranslation } from 'react-i18next';

export const useTextContent = () => {
  const { id, language, isPdf }   = useSelector(state => textPage.getFile(state.textPage)) || false;
  const { wip, err, data } = useSelector(state => assets.getDoc2htmlById(state.assets))[id] || false;

  const dispatch = useDispatch();
  const { t }    = useTranslation();
  const needFetch = !isPdf && !wip && !err && !data;
  console.log('not ssr text bug: useTextContent render', needFetch)
  useEffect(() => {
    needFetch && dispatch(actions.doc2html(id));
  }, [id, needFetch]);

  useEffect(() => {
    needFetch && dispatch(textActions.setUrlPath());
  }, [id, language]);


  console.log('not ssr text bug: useTextContent render wip || !id', wip || !id)
  const wipErr = WipErr({ wip: wip || !id, err, t });
  return wipErr;
};


import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { actions as textActions } from '../../../../redux/modules/textPage';
import { selectors as assets, actions } from '../../../../redux/modules/assets';
import WipErr from '../../../shared/WipErr/WipErr';
import { useTranslation } from 'react-i18next';
import { textPageGetFileSelector } from '../../../../redux/selectors';

export const useTextContent = () => {
  const { id, language, isPdf } = useSelector(textPageGetFileSelector) || false;
  const { wip, err, data }      = useSelector(state => assets.getDoc2htmlById(state.assets))[id] || false;

  const dispatch  = useDispatch();
  const { t }     = useTranslation();
  const needFetch = !isPdf && !wip && !err && !data;

  useEffect(() => {
    needFetch && dispatch(actions.doc2html(id));
  }, [id, needFetch]);

  const wipErr = WipErr({ wip: wip || !id, err, t });
  return wipErr;
};


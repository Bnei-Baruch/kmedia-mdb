import { Fragment, useContext, useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import { actions as mdbActions } from '../../../../../redux/modules/mdb';
import Helmets from '../../../../shared/Helmets/index';
import MediaDownloads from '../../../../Pages/WithPlayer/widgets/MediaDownloads';
import { getWipErr } from '../../../../shared/WipErr/WipErr';
import Recommended from '../../../../Pages/WithPlayer/widgets/Recommended/Main/Recommended';
import { getEmbedFromQuery } from '../../../../../helpers/player';
import { ClientChroniclesContext, DeviceInfoContext } from '../../../../../helpers/app-contexts';
import TextLayoutWeb from '../../../../Pages/WithText/TextLayoutWeb';
import ArticleToolbarMobile from './ArticleToolbarMobile';
import ArticleToolbarWeb from './ArticleToolbarWeb';
import ArticleHeader from './ArticleHeader';
import {
  mdbGetDenormContentUnitSelector,
  mdbGetErrorsSelector,
  mdbGetWipFn
} from '../../../../../redux/selectors';
import TextLayoutMobile from '../../../../Pages/WithText/TextLayoutMobile';

const renderHelmet = unit => (
  <Fragment>
    <Helmets.NoIndex />
    <Helmets.ArticleUnit unit={unit} />
  </Fragment>
);

const ArticlePage = () => {
  const { id } = useParams();
  const location = useLocation();

  const chronicles = useContext(ClientChroniclesContext);
  const { isMobile } = useContext(DeviceInfoContext);

  const unit = useSelector(state => mdbGetDenormContentUnitSelector(state, id));
  const wip = useSelector(mdbGetWipFn).units[id];
  const err = useSelector(mdbGetErrorsSelector).units[id];

  const dispatch = useDispatch();

  useEffect(() => {
    if (wip || err || (unit && unit.id === id && Array.isArray(unit.files))) {
      return;
    }

    dispatch(mdbActions.fetchUnit(id));
  }, [dispatch, err, id, unit, wip]);

  const wipErr = getWipErr(wip, err);
  if (wipErr) {
    return wipErr;
  }

  if (!unit) {
    return null;
  }

  const chroniclesAppend = chronicles ? chronicles.append.bind(chronicles) : () => null;
  const toolbar = isMobile ? <ArticleToolbarMobile /> : <ArticleToolbarWeb />;
  const { embed } = getEmbedFromQuery(location);

  return !embed
    ? (
      <>
        {renderHelmet(unit)}
        <div className="flex flex-wrap">
          <div className="flex-1 md:w-[64%]">
            <ArticleHeader unit={unit} />
            <div className="py-4">
              {
                isMobile ? (
                  <TextLayoutMobile toolbar={toolbar} playerPage={true} />
                ) : (
                  <TextLayoutWeb toolbar={toolbar} playerPage={true} />
                )
              }
              <MediaDownloads unit={unit} displayDivider={true} chroniclesAppend={chroniclesAppend} />
            </div>
          </div>
          <div className="w-full md:w-[36%]">
            <Recommended cuId={unit.id} />
          </div>
        </div>
      </>
    ) : (
      <ArticleHeader unit={unit} />
    );
};

export default ArticlePage;

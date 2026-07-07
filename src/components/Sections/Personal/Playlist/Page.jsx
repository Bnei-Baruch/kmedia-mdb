import {  useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';


import { actions } from '../../../../redux/modules/my';
import { MY_NAMESPACE_PLAYLISTS } from '../../../../helpers/consts';
import { getWipErr } from '../../../shared/WipErr/WipErr';
import ContentItemContainer from '../../../shared/ContentItem/ContentItemContainer';
import AlertModal from '../../../shared/AlertModal';
import PlaylistHeaderContainer from './HeaderContainer';
import NeedToLogin from '../NeedToLogin';
import { getMyItemKey } from '../../../../helpers/my';
import { FrownSplash } from '../../../shared/Splash/Splash';
import { stopBubbling } from '../../../../helpers/utils';
import { withRouter } from '../../../../helpers/withRouterPatch';
import { stringify } from '../../../../helpers/url';
import {
  myGetDeletedSelector,
  myGetErrSelector,
  myGetItemByKeySelector,
  myGetWipSelector,
  settingsGetUILangSelector,
  authGetUserSelector
} from '../../../../redux/selectors';

const Page = () => {
  const { t } = useTranslation();
  const { id } = useParams();

  const { key } = getMyItemKey(MY_NAMESPACE_PLAYLISTS, { id });
  const uiLang = useSelector(settingsGetUILangSelector);
  const playlist = useSelector(state => myGetItemByKeySelector(state, MY_NAMESPACE_PLAYLISTS, key));
  const wip = useSelector(state => myGetWipSelector(state, MY_NAMESPACE_PLAYLISTS));
  const err = useSelector(state => myGetErrSelector(state, MY_NAMESPACE_PLAYLISTS));
  const deleted = useSelector(state => myGetDeletedSelector(state, MY_NAMESPACE_PLAYLISTS));
  const user = useSelector(authGetUserSelector);
  const dispatch = useDispatch();

  useEffect(() => {
    id && dispatch(actions.fetchOne(MY_NAMESPACE_PLAYLISTS, { id }));
  }, [id, uiLang, user, dispatch]);

  const needToLogin = NeedToLogin();
  if (needToLogin) return needToLogin;

  const wipErr = getWipErr(wip, err);
  if (wipErr) return wipErr;

  if (!playlist) return null;

  const pathname = `/${uiLang}/${MY_NAMESPACE_PLAYLISTS}/${id}`;
  const items = [...(playlist.items || [])];
  items.sort((a, b) => b.position - a.position);

  const removeItem = piID => dispatch(actions.remove(MY_NAMESPACE_PLAYLISTS, { id, ids: [piID], changeItems: true }));

  const onAlertCloseHandler = () => dispatch(actions.setDeleted(MY_NAMESPACE_PLAYLISTS, false));

  const changeItemPosition = (i, up) => {
    const currentItem = items[i];
    const nextItem = up ? items[i - 1] : items[i + 1];
    let cp, np;
    if (currentItem.position === nextItem.position) {
      cp = up ? currentItem.position + 1 : currentItem.position - 1;
      np = nextItem.position;
    } else {
      np = currentItem.position;
      cp = nextItem.position;
    }

    const _items = [{ ...currentItem, position: cp || 1 }, { ...nextItem, position: np || 1 }];
    dispatch(actions.edit(MY_NAMESPACE_PLAYLISTS, { id, items: _items, changeItems: true }));
  };

  const renderItem = (x, i) => {
    const { content_unit_uid, name, properties } = x;
    const search = stringify({ ...properties, ap: i });

    return (
      <ContentItemContainer
        id={content_unit_uid}
        key={i}
        link={{ pathname, search }}
        name={name}
        asList
      >
        <div className="my_playlist_actions" onClick={stopBubbling}>
          <button
            className="no-shadow inline-flex items-center px-2 cursor-pointer"
            disabled={i === 0}
            onClick={() => changeItemPosition(i, true)}
          >
            <span className="material-symbols-outlined">arrow_upward</span>
          </button>
          <div className="relative inline-block group/remove">
            <button
              className="no-shadow inline-flex items-center px-2 cursor-pointer"
              onClick={() => removeItem(x.id)}
            >
              <span className="material-symbols-outlined">cancel</span>
            </button>
            <div className="absolute top-full end-1 mt-1 hidden group-hover/remove:block rounded bg-white p-2 shadow-lg whitespace-nowrap text-xs z-10 pointer-events-none">
              {t('personal.removeFromPlaylist')}
            </div>
          </div>
          <button
            className="no-shadow inline-flex items-center px-2 cursor-pointer"
            disabled={i === items.length - 1}
            onClick={() => changeItemPosition(i, false)}
          >
            <span className="material-symbols-outlined">arrow_downward</span>
          </button>
        </div>
      </ContentItemContainer>
    );
  };

  return (
    <>
      <PlaylistHeaderContainer playlist={playlist} />
      <AlertModal message={t('personal.removedSuccessfully')} open={deleted} onClose={onAlertCloseHandler} />
      {
        items?.length > 0 ? (
          <div className="p-4">
            {items.map(renderItem)}
          </div>
        ) : <FrownSplash text={t('messages.not-found')} />
      }
    </>
  );
};

export default withRouter(Page);

import React, { useContext, useEffect } from 'react';
import { withTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Popover } from '@headlessui/react';
import { clsx } from 'clsx';

import { actions } from '../../../../redux/modules/my';
import { DeviceInfoContext } from '../../../../helpers/app-contexts';
import { MY_NAMESPACE_PLAYLISTS } from '../../../../helpers/consts';
import WipErr from '../../../shared/WipErr/WipErr';
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

const Page = ({ t }) => {
  const { id } = useParams();

  const { isMobileDevice } = useContext(DeviceInfoContext);
  const { key }            = getMyItemKey(MY_NAMESPACE_PLAYLISTS, { id });
  const uiLang             = useSelector(settingsGetUILangSelector);
  const playlist           = useSelector(state => myGetItemByKeySelector(state, MY_NAMESPACE_PLAYLISTS, key));
  const wip                = useSelector(state => myGetWipSelector(state, MY_NAMESPACE_PLAYLISTS));
  const err                = useSelector(state => myGetErrSelector(state, MY_NAMESPACE_PLAYLISTS));
  const deleted            = useSelector(state => myGetDeletedSelector(state, MY_NAMESPACE_PLAYLISTS));
  const user               = useSelector(authGetUserSelector);
  const dispatch           = useDispatch();

  useEffect(() => {
    id && dispatch(actions.fetchOne(MY_NAMESPACE_PLAYLISTS, { id }));
  }, [id, uiLang, user, dispatch]);

  const needToLogin = NeedToLogin({ t });
  if (needToLogin) return needToLogin;

  const wipErr = WipErr({ wip, err, t });
  if (wipErr) return wipErr;

  if (!playlist) return null;

  const pathname      = `/${uiLang}/${MY_NAMESPACE_PLAYLISTS}/${id}`;
  const computerWidth = isMobileDevice ? 'w-full' : 'w-full md:w-[62.5%]';
  const items         = [...playlist.items || []];
  items.sort((a, b) => b.position - a.position);

  const removeItem = piID => dispatch(actions.remove(MY_NAMESPACE_PLAYLISTS, { id, ids: [piID], changeItems: true }));

  const onAlertCloseHandler = () => dispatch(actions.setDeleted(MY_NAMESPACE_PLAYLISTS, false));

  const changeItemPosition = (i, up) => {
    const currentItem = items[i];
    const nextItem    = up ? items[i - 1] : items[i + 1];
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
    const search                                 = stringify({ ...properties, ap: i });

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
            className="no-shadow inline-flex items-center rounded border border-gray-300 px-2 py-1"
            disabled={i === 0}
            onClick={() => changeItemPosition(i, true)}
          >
            <span className="material-symbols-outlined text-base">arrow_upward</span>
          </button>
          <Popover className="relative inline-block">
            <Popover.Button
              className="no-shadow inline-flex items-center rounded border border-gray-300 px-2 py-1"
              onClick={() => removeItem(x.id)}
              title={t('personal.removeFromPlaylist')}
            >
              <span className="material-symbols-outlined text-base">cancel</span>
            </Popover.Button>
            <Popover.Panel className="absolute z-10 mt-1 rounded bg-white p-2 small shadow-lg whitespace-nowrap">
              {t('personal.removeFromPlaylist')}
            </Popover.Panel>
          </Popover>
          <button
            className="no-shadow inline-flex items-center rounded border border-gray-300 px-2 py-1"
            disabled={i === items.length - 1}
            onClick={() => changeItemPosition(i, false)}
          >
            <span className="material-symbols-outlined text-base">arrow_downward</span>
          </button>
        </div>
      </ContentItemContainer>
    );
  };

  return (
    <div className="flex flex-wrap avbox no-background">
      <div className="flex flex-wrap w-full">
        <div className={clsx(computerWidth, { 'is-fitted': isMobileDevice })}>
          <PlaylistHeaderContainer playlist={playlist}/>
          <AlertModal message={t('personal.removedSuccessfully')} open={deleted} onClose={onAlertCloseHandler}/>
          {
            items?.length > 0 ? (
              <div className=" px-4 ">
                {items.map(renderItem)}
              </div>
            ) : <FrownSplash text={t('messages.not-found')}/>
          }
        </div>
        {
          !isMobileDevice && <div className="w-full md:w-[37.5%]"/>
        }
      </div>
    </div>
  );
};

export default withTranslation()(withRouter(Page));

import React from 'react';
import { useSelector } from 'react-redux';

import Link from '../../Language/MultiLanguageLink';
import { useTranslation } from 'react-i18next';
import usePlaylistItemLink from '../hooks/usePlaylistItemLink';
import WebWrapTooltip from '../../shared/WebWrapTooltip';
import { useLocation } from 'react-router-dom';
import { playlistGetNextIdSelector, playlistGetPrevIdSelector } from '../../../redux/selectors';
import { getEmbedFromQuery, EMBED_TYPE_PLAYER, EMBED_TYPE_PLAYLIST } from '../../../helpers/player';

export const PrevBtn = () => {
  const id       = useSelector(playlistGetPrevIdSelector);
  const { t }    = useTranslation();
  const location = useLocation();
  const to       = usePlaylistItemLink(id);
  const { type } = getEmbedFromQuery(location);

  if (type === EMBED_TYPE_PLAYER || !to) return null;
  if (type === EMBED_TYPE_PLAYLIST) {
    to.search = 'embed=2';
  }

  return (
    <WebWrapTooltip
      content={t('player.controls.prev-video')}
      position="top left"
      trigger={
        <Link
          as="div"
          className="controls__prev"
          to={to}
        >
          <span className="material-symbols-outlined text-2xl">fast_rewind</span>
        </Link>
      }/>
  );
};

export const NextBtn = () => {
  const id       = useSelector(playlistGetNextIdSelector);
  const { t }    = useTranslation();
  const location = useLocation();
  const to       = usePlaylistItemLink(id);
  const { type } = getEmbedFromQuery(location);

  if (type === EMBED_TYPE_PLAYER || !to) return null;
  if (type === EMBED_TYPE_PLAYLIST) {
    to.search = 'embed=2';
  }

  return (
    <WebWrapTooltip
      content={t('player.controls.next-video')}
      position="top right"
      trigger={
        <Link
          as="div"
          className="controls__next"
          to={to}
        >
          <span className="material-symbols-outlined text-2xl">fast_forward</span>
        </Link>
      }
    />
  );
};

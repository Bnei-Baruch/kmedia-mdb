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
    <div className="controls__prev">
      <WebWrapTooltip
        content={t('player.controls.prev-video')}
        trigger={
          <Link as="div" to={to}>
            <div className="material-symbols-outlined text-4xl">fast_rewind</div>
          </Link>
        }/>
    </div>
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
    <div className="controls__next">
      <WebWrapTooltip
        content={t('player.controls.next-video')}
        trigger={
          <Link as="div" to={to}>
            <div className="material-symbols-outlined text-4xl">fast_forward</div>
          </Link>
        }
      />
    </div>
  );
};

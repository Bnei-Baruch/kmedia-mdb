import React from 'react';
import { Icon } from 'semantic-ui-react';
import { useSelector } from 'react-redux';

import { selectors } from '../../redux/slices/playlistSlice/playlistSlice';
import Link from 'next/link';
import { useTranslation } from 'next-i18next';
import usePlaylistItemLink from '../hooks/usePlaylistItemLink';
import WebWrapTooltip from '../../../src/components/shared/WebWrapTooltip';
import { useSearchParams } from 'next/navigation';

export const PrevBtn = () => {
  const id        = useSelector(state => selectors.getPrevId(state.playlist));
  const { t }     = useTranslation();
  const { embed } = useSearchParams();
  const to        = usePlaylistItemLink(id);

  if (embed || !to) return null;

  return (
    <WebWrapTooltip
      content={t('player.controls.prev-video')}
      position="top left"
      trigger={
        <Link
          as="div"
          className="controls__prev"
          href={to}
        >
          <Icon fitted size="big" name="backward" />
        </Link>
      } />
  );
};

export const NextBtn = () => {
  const id        = useSelector(state => selectors.getNextId(state.playlist));
  const { t }     = useTranslation();
  const { embed } = useSearchParams();
  const to        = usePlaylistItemLink(id);

  if (embed || !to) return null;

  return (
    <WebWrapTooltip
      content={t('player.controls.next-video')}
      position="top right"
      trigger={
        <Link
          as="div"
          className="controls__next"
          href={to}
        >
          <Icon fitted size="big" name="forward" />
        </Link>
      }
    />
  );
};


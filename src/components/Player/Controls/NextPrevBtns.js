import React from 'react';
import { Icon } from 'semantic-ui-react';
import { useSelector } from 'react-redux';

import { selectors } from '../../../redux/modules/playlist';
import Link from '../../Language/MultiLanguageLink';
import { withTranslation } from 'react-i18next';
import usePlaylistItemLink from '../hooks/usePlaylistItemLink';
import WebWrapTooltip from '../../shared/WebWrapTooltip';

export const PrevBtn = withTranslation()(({ t }) => {
  const id = useSelector(state => selectors.getPrevId(state.playlist));

  const to = usePlaylistItemLink(id);
  if (!to) return null;

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
          <Icon fitted size="big" name="backward" />
        </Link>
      } />
  );
});

export const NextBtn = withTranslation()(({ t }) => {
  const id = useSelector(state => selectors.getNextId(state.playlist));

  const to = usePlaylistItemLink(id);
  if (!to) return null;

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
          <Icon fitted size="big" name="forward" />
        </Link>
      }
    />
  );
});

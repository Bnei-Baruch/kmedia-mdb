import React from 'react';
import { Popup, Icon } from 'semantic-ui-react';
import { useSelector } from 'react-redux';

import { selectors } from '../../../redux/modules/playlist';
import Link from '../../Language/MultiLanguageLink';
import { withNamespaces } from 'react-i18next';
import usePlaylistItemLink from '../hooks/usePlaylistItemLink';

export const PrevBtn = withNamespaces()(({ t }) => {
  const id = useSelector(state => selectors.getPrevId(state.playlist));

  const link = usePlaylistItemLink(id);
  return (
    <Popup content={t('player.controls.prev-video')} inverted size="mini" position="top left" trigger={
      <Link
        as="div"
        className="controls__prev"
        to={link}
      >
        <Icon fitted size="big" name="backward" />
      </Link>
    } />
  );
});

export const NextBtn = withNamespaces()(({ t }) => {
  const id = useSelector(state => selectors.getNextId(state.playlist));

  const link = usePlaylistItemLink(id);
  if (!link) return null;

  return (
    <Popup content={t('player.controls.next-video')} inverted size="mini" position="top right" trigger={
      <Link
        as="div"
        className="controls__next"
        to={link}
      >
        <Icon fitted size="big" name="forward" />
      </Link>
    } />
  );
});

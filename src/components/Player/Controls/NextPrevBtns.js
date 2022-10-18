import React from 'react';
import { Popup, Icon } from 'semantic-ui-react';
import { useSelector } from 'react-redux';

import { selectors } from '../../../redux/modules/playlist';
import { selectors as mdb } from '../../../redux/modules/mdb';
import { canonicalLink } from '../../../helpers/links';
import Link from '../../Language/MultiLanguageLink';

export const PrevBtn = () => {
  const { id, cId, idx } = useSelector(state => selectors.getPrevData(state.playlist));
  const cu               = useSelector(state => mdb.getDenormContentUnit(state.mdb, id));
  const baseLink         = useSelector(state => selectors.getInfo(state.playlist).baseLink);

  if (!cu) return null;

  let link = '';
  if (baseLink) {
    link = `${baseLink}?ap=${idx}`;
  } else {
    link = canonicalLink(cu, null, cId);
  }
  return (
    <Popup content="Previous video" inverted size="mini" position="top left" trigger={
      <Link
        as="div"
        className="controls__prev"
        to={link}
      >
        <Icon fitted size="big" name="backward" />
      </Link>
    } />
  );
};

export const NextBtn = () => {
  const { id, cId, idx } = useSelector(state => selectors.getNextData(state.playlist));
  const cu               = useSelector(state => mdb.getDenormContentUnit(state.mdb, id));
  const baseLink         = useSelector(state => selectors.getInfo(state.playlist).baseLink);

  if (!cu) return null;

  let link = '';
  if (baseLink) {
    link = `${baseLink}?ap=${idx}`;
  } else {
    link = canonicalLink(cu, null, cId);
  }

  return (
    <Popup content="Next video" inverted size="mini" position="top right" trigger={
      <Link
        as="div"
        className="controls__next"
        to={link}
      >
        <Icon fitted size="big" name="forward" />
      </Link>
    } />
  );
};

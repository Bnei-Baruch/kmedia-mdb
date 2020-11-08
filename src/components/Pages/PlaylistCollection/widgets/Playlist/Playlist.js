import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { withNamespaces } from 'react-i18next';
import { Header, Icon, List } from 'semantic-ui-react';
import isEqual from 'react-fast-compare';

import { CT_DAILY_LESSON, CT_SPECIAL_LESSON } from '../../../../../helpers/consts';
import { fromToLocalized } from '../../../../../helpers/date';
import { getLanguageDirection } from '../../../../../helpers/i18n-utils';
import Link from '../../../../Language/MultiLanguageLink';
import { renderPlaylistUnit } from '../../../Unit/widgets/Recommended/Main/DisplayRecommended';
import { selectors as settings } from '../../../../../redux/modules/settings';

const getContentByType = (collection, t) => {
  const { content_type, number } = collection;
  const ct = content_type === CT_SPECIAL_LESSON ? CT_DAILY_LESSON : content_type;
  return `${t(`constants.content-types.${ct}`)}${number ? ` ${t('lessons.list.number')}${number}` : ''}`;
}

const getSubHeader = (collection, t) => {
  const { film_date, start_date, end_date } = collection;
  let subheader = '';
  if (film_date) {
    subheader = t('values.date', { date: film_date });
  } else if (start_date && end_date) {
    subheader = fromToLocalized(start_date, end_date);
  }

  return subheader;
}

const PlaylistWidget = ({ playlist, selected = 0, onSelectedChange, t, prevLink = null, nextLink = null}) => {
  const uiLanguage = useSelector(state => settings.getLanguage(state.settings));

  const handleItemClick = useCallback((e, data) => {
    onSelectedChange(parseInt(data.name, 10));
  }, [onSelectedChange]);

  const getNextLink = langDir =>
    nextLink
      ? <Link
        to={nextLink}
        className="avbox__playlist-next-button"
        title={t('buttons.next')}
      >
        <Icon name={langDir === 'ltr' ? 'forward' : 'backward'} />
      </Link>
      : null;

  const getPrevLink = langDir =>
    prevLink
      ? <Link
        to={prevLink}
        className="avbox__playlist-prev-button"
        title={t('buttons.previous')}
      >
        <Icon name={langDir === 'ltr' ? 'backward' : 'forward'} />
      </Link>
      : null;

  const { collection } = playlist;
  const langDir = getLanguageDirection(uiLanguage);
  const unitsToDisplay = playlist.items.filter(item => !!item.unit).map(item => item.unit);

  return (
    <div id="avbox_playlist" className="avbox__playlist-wrapper">
      <Header as="h3">
        {collection.name || getContentByType(collection, t)}
        <Header.Subheader>
          {getPrevLink(langDir)}
          {getSubHeader(collection, t)}
          {getNextLink(langDir)}
        </Header.Subheader>
      </Header>
      <div className="avbox__playlist-view">
        {/* cannot use semantic Item because it doesn't recongnize the onClick event */}
        <List selection size="tiny">
          {
            unitsToDisplay.map((unit, index) => (
              <List.Item
                key={unit.id}
                name={`${index}`}
                active={index === selected}
                onClick={handleItemClick}
              >
                {renderPlaylistUnit(unit, t)}
              </List.Item>
            ))
          }
        </List>
      </div>
    </div>
  );
}

PlaylistWidget.propTypes = {
  playlist: PropTypes.shape({}).isRequired,
  selected: PropTypes.number,
  onSelectedChange: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
  nextLink: PropTypes.string,
  prevLink: PropTypes.string,
};

const areEqual = (prevProps, nextProps) => (
  nextProps.selected === prevProps.selected
    && nextProps.nextLink === prevProps.nextLink
    && nextProps.prevLink === prevProps.prevLink
    && isEqual(nextProps.playlist, prevProps.playlist)
);

export default React.memo(withNamespaces()(PlaylistWidget), areEqual);

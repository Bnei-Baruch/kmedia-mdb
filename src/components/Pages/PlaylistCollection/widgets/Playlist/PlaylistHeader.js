import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { withNamespaces } from 'react-i18next';
import { Header, Icon } from 'semantic-ui-react';

import * as shapes from '../../../../shapes';
import { getLanguageDirection } from '../../../../../helpers/i18n-utils';
import { CT_DAILY_LESSON, CT_SPECIAL_LESSON } from '../../../../../helpers/consts';
import { fromToLocalized } from '../../../../../helpers/date';
import Link from '../../../../Language/MultiLanguageLink';
import { selectors as settings } from '../../../../../redux/modules/settings';
import CollectionDatePicker from './CollectionDatePicker';

const getNextLink = (langDir, t, link) => (
  link ?
    <Link
      to={link}
      className="avbox__playlist-next-button"
      title={t('buttons.next')}
    >
      <Icon size="large" name={`triangle ${langDir === 'ltr' ? 'right' : 'left'}`} />
    </Link> :
    <span className="avbox__playlist-next-button">
      <Icon disabled size="large" name={`triangle ${langDir === 'ltr' ? 'right' : 'left'}`} />
    </span>
);

const getPrevLink = (langDir, t, link) => (
  link &&
  <Link
    to={link}
    className="avbox__playlist-prev-button"
    title={t('buttons.previous')}
  >
    <Icon size="large" name={`triangle ${langDir === 'ltr' ? 'left' : 'right'}`} />
  </Link>
);

const PlaylistHeader = ({ collection, t, prevLink = null, nextLink = null }) => {
  const uiLanguage = useSelector(state => settings.getLanguage(state.settings));
  const langDir    = getLanguageDirection(uiLanguage);

  const { content_type, number, name, film_date, start_date, end_date } = collection;

  const isLesson = content_type === CT_DAILY_LESSON || content_type === CT_SPECIAL_LESSON;

  const getSubHeader = () => {
    if (!isLesson) return null;

    return (
      <Header.Subheader>
        {getPrevLink(langDir, t, prevLink)}
        <CollectionDatePicker collection={collection} />
        {getNextLink(langDir, t, nextLink)}
      </Header.Subheader>
    );
  };

  const getTitleByCO = () => {
    const ct      = content_type === CT_SPECIAL_LESSON ? CT_DAILY_LESSON : content_type;
    let subheader = '';

    if (isLesson) {
      subheader = `${t('values.date', { date: film_date })}${number && ` (${t('lessons.list.nameByNum_' + number)})`}`;
    } else if (film_date) {
      subheader = t('values.date', { date: film_date });
    } else if (start_date && end_date) {
      subheader = fromToLocalized(start_date, end_date);
    }

    return (
      <>
        {name || t(`constants.content-types.${ct}`)}
        <small className="display-block">
          {subheader}
        </small>
      </>
    );
  };

  return (
    <Header as="h2" className={`avbox__playlist-header ${isLesson ? '' : ' flex_column'}`}>
      <Header.Content content={getTitleByCO(collection, t)} />
      {getSubHeader()}
    </Header>
  );
};

PlaylistHeader.propTypes = {
  collection: shapes.GenericCollection.isRequired,
  t: PropTypes.func.isRequired,
  nextLink: PropTypes.string,
  prevLink: PropTypes.string,
};

export default withNamespaces()(PlaylistHeader);

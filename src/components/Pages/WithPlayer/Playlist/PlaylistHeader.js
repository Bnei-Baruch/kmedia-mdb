import React, { useContext } from 'react';
import { useSelector } from 'react-redux';
import { withNamespaces } from 'react-i18next';
import { Header, Icon } from 'semantic-ui-react';
import clsx from 'clsx';

import { selectors as settings } from '../../../../redux/modules/settings';
import { selectors as sources } from '../../../../redux/modules/sources';
import { COLLECTION_DAILY_LESSONS, CT_LESSONS_SERIES } from '../../../../helpers/consts';
import { getLanguageDirection } from '../../../../helpers/i18n-utils';
import { DeviceInfoContext } from '../../../../helpers/app-contexts';
import { cuPartNameByCCUType } from '../../../../helpers/utils';
import { fromToLocalized } from '../../../../helpers/date';
import Link from '../../../Language/MultiLanguageLink';
import CollectionDatePicker from './CollectionDatePicker';
import PlaylistPlayIcon from '../../../../images/icons/PlaylistPlay';
import { selectors as mdb } from '../../../../redux/modules/mdb';

const getNextLink = (langDir, t, link) => (
  link ?
    <Link
      to={link}
      className="avbox__playlist-next-button"
      title={t('buttons.next-lesson')}
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
    title={t('buttons.previous-lesson')}
  >
    <Icon size="large" name={`triangle ${langDir === 'ltr' ? 'left' : 'right'}`} />
  </Link>
);

const PlaylistHeader = ({ cId, cuId, t, nextLink = null, prevLink = null }) => {
  const { isMobileDevice } = useContext(DeviceInfoContext);

  const unit       = useSelector(state => mdb.getDenormContentUnit(state.mdb, cuId));
  const collection = useSelector(state => mdb.getDenormCollection(state.mdb, cId));
  const getPath    = useSelector(state => sources.getPathByID(state.sources));
  const uiLanguage = useSelector(state => settings.getLanguage(state.settings));
  const langDir    = getLanguageDirection(uiLanguage);

  const { content_type, number, name, film_date, start_date, end_date, tag_id, source_id } = collection;

  const isLesson = COLLECTION_DAILY_LESSONS.includes(content_type);

  const getSubHeader = () => {
    if (!isLesson) return null;

    return (
      <Header.Subheader className={isMobileDevice ? '' : langDir === 'rtl' ? 'float-left' : 'float-right'}>
        {getPrevLink(langDir, t, prevLink)}
        <CollectionDatePicker collection={collection} />
        {getNextLink(langDir, t, nextLink)}
      </Header.Subheader>
    );
  };

  const getTitle = () => {
    if (!content_type)
      return (
        <>
          <PlaylistPlayIcon className="playlist_icon" fill="#FFFFFF" />
          {t('personal.playlist', { name })}
        </>
      );

    if (isLesson) {
      return !isMobileDevice ? (
        <>
          {t('constants.content-types.DAILY_LESSON')}
          <small>
            <span className="display-iblock margin-left-8 margin-right-8">{t('values.date', { date: film_date })}</span>
            {(number && number < 5) ? `(${t(`lessons.list.nameByNum_${number}`)})` : ''}
          </small>
        </>
      ) : t('constants.content-types.DAILY_LESSON');
    }

    if (tag_id && tag_id.length > 0) {
      return `${t('player.header.series-by-topic')} ${name}`;
    }

    if (source_id && getPath) {
      const path = getPath(source_id);
      return `${t('player.header.series-by-topic')} ${path[0].name} - ${name}`;
    }

    return name;
  };

  const getTitleByCO = () => {
    let subheader;
    if (isLesson) {
      subheader = isMobileDevice && `${t('values.date', { date: film_date })}${(number && number < 5) ? ` (${t(`lessons.list.nameByNum_${number}`)})` : ''}`;
    } else if (film_date) {
      subheader = t('values.date', { date: film_date });
    } else if (start_date && end_date) {
      subheader = fromToLocalized(start_date, end_date);
    }

    let playNow;
    if (!isMobileDevice) {
      const part = collection?.ccuNames?.[unit.id] ? Number(collection.ccuNames[unit.id]) : null;
      if (isLesson) {
        playNow = (!isNaN(part) && part > 0) ? `${t(cuPartNameByCCUType(content_type), { name: part })} ${unit.name}` : unit.name;
      } else if (content_type === CT_LESSONS_SERIES) {
        playNow = <>
          {t(cuPartNameByCCUType(content_type), { name: part })}
          <small className="display-iblock margin-left-8 margin-right-8 font-normal">
            {t('values.date', { date: unit.film_date })}
          </small>
        </>;
      } else {
        playNow = unit?.name;
      }
    }

    return (
      <>
        {!isMobileDevice && getSubHeader()}
        {getTitle()}
        {
          subheader && (
            <Header
              as="h4"
              inverted
              className="font-normal"
              content={subheader}
            />
          )
        }
        {
          playNow && (
            <Header
              as="h2"
              inverted
              content={playNow}
            />
          )
        }
      </>
    );
  };

  return (
    <Header as="h2" className={clsx('avbox__playlist-header', { 'flex_column': !isLesson })}>
      <Header.Content content={getTitleByCO()} />
      {isMobileDevice && getSubHeader()}
    </Header>
  );
};

export default withNamespaces()(PlaylistHeader);
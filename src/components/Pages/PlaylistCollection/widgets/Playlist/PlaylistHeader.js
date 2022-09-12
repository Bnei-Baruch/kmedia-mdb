import React, { useContext, useCallback, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useSelector, shallowEqual, useDispatch } from 'react-redux';
import { withTranslation } from 'react-i18next';
import { Header, Icon } from 'semantic-ui-react';
import clsx from 'clsx';
import moment from 'moment';

import * as shapes from '../../../../shapes';
import { actions, selectors } from '../../../../../redux/modules/mdb';
import { selectors as settings } from '../../../../../redux/modules/settings';
import { selectors as sources } from '../../../../../redux/modules/sources';
import { COLLECTION_DAILY_LESSONS, CT_LESSONS_SERIES, DATE_FORMAT } from '../../../../../helpers/consts';
import { getLanguageDirection } from '../../../../../helpers/i18n-utils';
import { DeviceInfoContext } from '../../../../../helpers/app-contexts';
import { cuPartNameByCCUType } from '../../../../../helpers/utils';
import { fromToLocalized } from '../../../../../helpers/date';
import { canonicalLink } from '../../../../../helpers/links';
import Link from '../../../../Language/MultiLanguageLink';
import CollectionDatePicker from './CollectionDatePicker';
import PlaylistPlayIcon from '../../../../../images/icons/PlaylistPlay';

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

const PlaylistHeader = ({ collection, unit, t }) => {
  const { isMobileDevice } = useContext(DeviceInfoContext);
  const wipMap             = useSelector(state => selectors.getWip(state.mdb), shallowEqual);
  const cWindow            = useSelector(state => selectors.getWindow(state.mdb), shallowEqual);
  const collections        = useSelector(state => cWindow?.data?.map(id => selectors.getDenormCollection(state.mdb, id)).filter(c => !!c), shallowEqual);
  const getPath            = useSelector(state => sources.getPathByID(state.sources));
  const uiLanguage         = useSelector(state => settings.getLanguage(state.settings));
  const langDir            = getLanguageDirection(uiLanguage);

  const [nextLink, setNextLink] = useState(null);
  const [prevLink, setPrevLink] = useState(null);

  const { id, content_type, number, name, film_date, start_date, end_date, tag_id, source_id } = collection;

  const isLesson = COLLECTION_DAILY_LESSONS.includes(content_type);

  const dispatch = useDispatch();

  const fetchWindow = useCallback(() => {
    const filmDate = moment.utc(film_date);
    dispatch(actions.fetchWindow({
      id,
      start_date: filmDate.subtract(5, 'days').format(DATE_FORMAT),
      end_date: filmDate.add(10, 'days').format(DATE_FORMAT)
    }));
  }, [id, film_date, dispatch]);

  const createPrevNextLinks = useCallback(curIndex => {
    const prevCollection = curIndex < collections.length - 1 ? collections[curIndex + 1] : null;
    const prevLnk        = prevCollection ? canonicalLink(prevCollection) : null;
    setPrevLink(prevLnk);

    const nextCollection = curIndex > 0 ? collections[curIndex - 1] : null;
    const nextLnk        = nextCollection ? canonicalLink(nextCollection) : null;
    setNextLink(nextLnk);
  }, [collections]);

  useEffect(() => {
    // next prev links only for lessons
    if (isLesson) {
      const { id: cWindowId, data } = cWindow || {};
      // empty or no window
      if (!data || data.length === 0) {
        if (!wipMap.cWindow[id]) {
          // no wip, go fetch
          fetchWindow(id, film_date);
        }
      } else {
        const curIndex = data.indexOf(id);

        if (id !== cWindowId
          && (curIndex <= 0 || curIndex === collections?.length - 1)
          && !wipMap.cWindow[id]) {
          // it's not our window,
          // we're not in it (at least not in the middle, we could reuse it otherwise)
          // and our window is not wip
          fetchWindow(id, film_date);
        } else {
          // it's a good window, extract the previous and next links
          createPrevNextLinks(curIndex);
        }
      }
    }
  }, [cWindow, collections, createPrevNextLinks, fetchWindow, film_date, id, isLesson, wipMap.cWindow]);


  const getSubHeader = () => {
    if (!isLesson) return null;

    return (
      <Header.Subheader className={isMobileDevice ? '' : langDir==='rtl' ? 'float-left' : 'float-right'}>
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

PlaylistHeader.propTypes = {
  collection: shapes.GenericCollection.isRequired,
  unit: shapes.ContentUnit,
  t: PropTypes.func.isRequired,
};

export default withTranslation()(PlaylistHeader);

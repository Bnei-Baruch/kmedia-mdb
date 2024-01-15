import React, { useContext } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { Header } from 'semantic-ui-react';
import clsx from 'clsx';
import { COLLECTION_DAILY_LESSONS, CT_LESSONS_SERIES } from '../../../../helpers/consts';
import { DeviceInfoContext } from '../../../../helpers/app-contexts';
import { cuPartNameByCCUType } from '../../../../helpers/utils';
import { fromToLocalized } from '../../../../helpers/date';
import PlaylistPlayIcon from '../../../../images/icons/PlaylistPlay';
import LessonDatePickerContainer from './LessonDatePickerContainer';
import { canonicalCollection } from '../../../../helpers/utils';
import { mdbGetDenormCollectionSelector, mdbGetDenormContentUnitSelector, playlistGetInfoSelector, sourcesGetPathByIDSelector } from '../../../../redux/selectors';

const PlaylistHeader = () => {
  const { isMobileDevice } = useContext(DeviceInfoContext);
  const { t }              = useTranslation();

  const { cId, cuId, name } = useSelector(playlistGetInfoSelector);
  const { id: paramsId }    = useParams();
  const unit                = useSelector(state => mdbGetDenormContentUnitSelector(state, cuId || paramsId));
  const c                   = canonicalCollection(unit);
  const collection          = useSelector(state => mdbGetDenormCollectionSelector(state, cId || (c && c.id) || paramsId));
  const getPath             = useSelector(sourcesGetPathByIDSelector);

  if (!unit) {
    return null;
  }

  const { content_type, number, film_date, start_date, end_date, tag_id, source_id, likutim_id } = collection || false;
  const isLesson                                                                                 = COLLECTION_DAILY_LESSONS.includes(content_type);

  const getTitle = () => {
    if (!collection)
      return (
        <>
          <PlaylistPlayIcon className="playlist_icon" fill="#FFFFFF"/>
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

    if (likutim_id?.length > 0) {
      return `${t('likutim.item-header')} ${name}`;
    }

    if (source_id && getPath) {
      const path         = getPath(source_id);
      const nameFromPath = path[0]?.name ? `${path[0].name} - ` : '';
      return `${t('player.header.series-by-topic')} ${nameFromPath}${name}`;
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
        {isLesson && !isMobileDevice && <LessonDatePickerContainer/>}
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
      <Header.Content content={getTitleByCO()}/>
      {isLesson && isMobileDevice && <LessonDatePickerContainer/>}
    </Header>
  );
};

export default PlaylistHeader;

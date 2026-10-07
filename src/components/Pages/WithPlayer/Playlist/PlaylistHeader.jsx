import { useContext } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { clsx } from 'clsx';
import { COLLECTION_DAILY_LESSONS, CT_LESSONS_SERIES } from '../../../../helpers/consts';
import { DeviceInfoContext } from '../../../../helpers/app-contexts';
import { cuPartNameByCCUType, canonicalCollection } from '../../../../helpers/utils';
import { fromToLocalized } from '../../../../helpers/date';
import { PlaylistPlay as PlaylistPlayIcon } from '../../../../images/icons';
import LessonDatePickerContainer from './LessonDatePickerContainer';
import {
  mdbGetDenormCollectionSelector,
  mdbGetDenormContentUnitSelector,
  playlistGetInfoSelector,
  sourcesGetPathByIDSelector
} from '../../../../redux/selectors';

const PlaylistHeader = () => {
  const { isMobile } = useContext(DeviceInfoContext);
  const { t } = useTranslation();

  const { cId, cuId, name, isMy } = useSelector(playlistGetInfoSelector);
  const { id: paramsId } = useParams();
  const unit = useSelector(state => mdbGetDenormContentUnitSelector(state, cuId || paramsId));
  const c = canonicalCollection(unit);
  const collection = useSelector(state => mdbGetDenormCollectionSelector(state, cId || (c && c.id) || paramsId));
  const getPath = useSelector(sourcesGetPathByIDSelector);

  if (!unit) {
    return null;
  }

  const { content_type, number, film_date, start_date, end_date, tag_id, source_id, likutim_id } = collection || false;
  const isLesson = COLLECTION_DAILY_LESSONS.includes(content_type);

  const getTitle = () => {
    if (!collection)
      return (
        <>
          <PlaylistPlayIcon className="playlist_icon" fill="#FFFFFF" />
          {t('personal.playlist', { name })}
        </>
      );

    if (isLesson) {
      return !isMobile ? (
        <>
          {t('constants.content-types.DAILY_LESSON')}
          <div className="text-[0.7em] display-iblock px-[5px]">
            <span className="display-iblock mx-1">{t('values.date', { date: film_date })}</span>
            {(number && number < 5) ? `(${t(`lessons.list.nameByNum_${number}`)})` : ''}
          </div>
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
      const path = getPath(source_id);
      const nameFromPath = path[0]?.name ? `${path[0].name} - ` : '';
      return `${t('player.header.series-by-topic')} ${nameFromPath}${name}`;
    }

    return name;
  };

  const getTitleByCO = () => {
    let subheader;
    if (isLesson) {
      subheader = isMobile && `${t('values.date', { date: film_date })}${(number && number < 5) ? ` (${t(`lessons.list.nameByNum_${number}`)})` : ''}`;
    } else if (film_date) {
      subheader = t('values.date', { date: film_date });
    } else if (start_date && end_date) {
      subheader = fromToLocalized(start_date, end_date);
    }

    let playNow;
    if (!isMobile) {
      const part = collection?.ccuNames?.[unit.id] ? Number(collection.ccuNames[unit.id]) : null;
      if (isLesson) {
        playNow = (!isNaN(part) && part > 0) ? `${t(cuPartNameByCCUType(content_type), { name: part })} ${unit.name}` : unit.name;
      } else if (content_type === CT_LESSONS_SERIES) {
        playNow = <>
          {t(cuPartNameByCCUType(content_type), { name: part })}
          <span className="mx-1 text-sm font-normal">
            {t('values.date', { date: unit.film_date })}
          </span>
        </>;
      } else {
        playNow = unit?.name;
      }
    }

    const _mobStyles = isMobile ? 'flex justify-between gap-2 items-end' : '';
    const hasDatePicker = isLesson && !isMobile && !isMy;

    return (
      <div className='avbox__playlist-header p-[14px]'>
        <div className='flex flex-justify gap-4 justify-between px-[28px]'>
          <h2 className='my-0 font-lato! text-[28px] leading-9 font-bold'>{getTitle()}</h2>
          {hasDatePicker && <LessonDatePickerContainer />}
        </div>
        {
          subheader && (
            <h4 className={clsx('font-lato! font-normal text-[15px] leading-[1.28571429em] px-[28px]', _mobStyles)}>
              {subheader}
              {isLesson && isMobile && !isMy && <LessonDatePickerContainer />}
            </h4>)
        }
        {playNow && (
          // Semantic header margin: calc(2rem - .14em), or -.14em when it is the first element in the block
          <h3 className={clsx('mb-0 px-[28px] font-lato! text-[24px] leading-[1.28571429em] font-bold', hasDatePicker || subheader ? 'mt-[24.57px]' : '-mt-[3.43px]')}>
            {playNow}
          </h3>
        )}
      </div>
    );
  };

  return (
    <div id="avbox_playlist">
      {getTitleByCO()}
    </div>
  );
};

export default PlaylistHeader;

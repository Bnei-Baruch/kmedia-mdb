import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { withTranslation } from 'next-i18next';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import { DATE_FORMAT } from '../../../../helpers/consts';
import { selectors as settings } from '../../../../../lib/redux/slices/settingsSlice/settingsSlice';
import { mdbSlice, selectors } from '../../../../../lib/redux/slices/mdbSlice';
import { selectors as playlist } from '../../../../../lib/redux/slices/playlistSlice/playlistSlice';
import ButtonDayPicker from '../../../Filters/components/Date/ButtonDayPicker';
import { canonicalLink } from '../../../../helpers/links';
import { DeviceInfoContext } from '../../../../helpers/app-contexts';
import { isEmpty } from '../../../../helpers/utils';
import { useRouter } from 'next/router';

const LessonDatePicker = ({ t }) => {
  const { isMobileDevice } = useContext(DeviceInfoContext);

  const router = useRouter();
  const uiLang = useSelector(state => settings.getUILang(state.settings));

  const { cId }      = useSelector(state => playlist.getInfo(state.playlist));
  const collection   = useSelector(state => selectors.getDenormCollectionWUnits(state.mdb, cId)) || false;
  const dpId         = useSelector(state => selectors.getDatepickerCO(state.mdb));
  const dpCollection = useSelector(state => selectors.getDenormCollectionWUnits(state.mdb, dpId)) || false;

  const dispatch = useDispatch();
  useEffect(() => {
    if (!isEmpty(dpCollection?.content_units) && collection.id !== dpCollection.id) {
      const href = canonicalLink(dpCollection.content_units[0]);
      router.push({ ...href, pathname: `/${uiLang}${href.pathname}` });
      dispatch(mdbSlice.actions.nullDatepickerCO());
    }
  }, [collection, dpCollection, uiLang, router, dispatch]);

  const fetchNextCO = date => {
    const filmDate = moment.utc(date);
    dispatch(actions.fetchDatepickerCO({
      start_date: filmDate.format(DATE_FORMAT),
      end_date: filmDate.format(DATE_FORMAT)
    }));
  };

  return (
    <ButtonDayPicker
      label={isMobileDevice ? collection.film_date : t('values.date', { date: collection.film_date })}
      uiLang={uiLang}
      onDayChange={fetchNextCO}
      value={new Date(collection.film_date)}
      withLabel={true}
    />
  );
};

export default withTranslation()(LessonDatePicker);

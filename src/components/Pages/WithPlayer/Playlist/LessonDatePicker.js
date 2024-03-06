import React, { useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { withTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import { DATE_FORMAT } from '../../../../helpers/consts';
import { actions as mdbActions } from '../../../../redux/modules/mdb';
import ButtonDayPicker from '../../../Filters/components/Date/ButtonDayPicker';
import { canonicalLink } from '../../../../helpers/links';
import { DeviceInfoContext } from '../../../../helpers/app-contexts';
import { isEmpty } from '../../../../helpers/utils';
import { getEmbedFromQuery, EMBED_TYPE_PLAYLIST } from '../../../../helpers/player';
import {
  mdbGetDatepickerCOSelector,
  mdbGetDenormCollectionWUnitsSelector,
  playlistGetInfoSelector,
  settingsGetUILangSelector
} from '../../../../redux/selectors';

const LessonDatePicker = ({ t }) => {
  const { isMobileDevice } = useContext(DeviceInfoContext);

  const navigate = useNavigate();
  const uiLang   = useSelector(settingsGetUILangSelector);
  const location = useLocation();
  const { type } = getEmbedFromQuery(location);

  const { isReady, cId } = useSelector(playlistGetInfoSelector);
  const collection       = useSelector(state => mdbGetDenormCollectionWUnitsSelector(state, cId)) || false;
  const dpId             = useSelector(mdbGetDatepickerCOSelector);
  const dpCollection     = useSelector(state => mdbGetDenormCollectionWUnitsSelector(state, dpId)) || false;

  const dispatch = useDispatch();
  if (!isEmpty(dpCollection?.content_units) && collection.id !== dpCollection.id) {
    const to = canonicalLink(dpCollection.content_units[0]);
    if (type === EMBED_TYPE_PLAYLIST) {
      to.search = 'embed=2';
    }

    navigate({ ...to, pathname: `/${uiLang}${to.pathname}` });
    dispatch(mdbActions.nullDatepickerCO());
  }

  if (!isReady) {
    return null;
  }

  const fetchNextCO = date => {
    const filmDate = moment.utc(date);
    dispatch(mdbActions.fetchDatepickerCO({
      start_date: filmDate.format(DATE_FORMAT),
      end_date  : filmDate.format(DATE_FORMAT)
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

import React, { useContext, useEffect } from 'react';
import { useHistory } from 'react-router';
import { withNamespaces } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import { DATE_FORMAT } from '../../../../helpers/consts';
import { selectors as settings } from '../../../../redux/modules/settings';
import { actions, selectors } from '../../../../redux/modules/mdb';
import { selectors as playlist } from '../../../../redux/modules/playlist';
import ButtonDayPicker from '../../../Filters/components/Date/ButtonDayPicker';
import { canonicalLink } from '../../../../helpers/links';
import { DeviceInfoContext } from '../../../../helpers/app-contexts';

const LessonDatePicker = ({ t }) => {
  const { isMobileDevice } = useContext(DeviceInfoContext);

  const history  = useHistory();
  const language = useSelector(state => settings.getLanguage(state.settings));

  const { cId }      = useSelector(state => playlist.getInfo(state.playlist));
  const collection   = useSelector(state => selectors.getDenormCollectionWUnits(state.mdb, cId)) || false;
  const dpId         = useSelector(state => selectors.getDatepickerCO(state.mdb));
  const dpCollection = useSelector(state => selectors.getDenormCollectionWUnits(state.mdb, dpId)) || false;

  const dispatch = useDispatch();
  useEffect(() => {
    if (dpCollection && collection.id !== dpCollection.id) {
      const link = canonicalLink(dpCollection.content_units[0]);
      history.push(`/${language}${link}`);
      dispatch(actions.nullDatepickerCO());
    }
  }, [collection, dpCollection, language, history, dispatch]);

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
      language={language}
      onDayChange={fetchNextCO}
      value={new Date(collection.film_date)}
      withLabel={true}
    />
  );
};

export default withNamespaces()(LessonDatePicker);
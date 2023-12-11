import React, { useContext, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { withTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import { DATE_FORMAT } from '../../../../helpers/consts';
import { selectors as settings } from '../../../../redux/modules/settings';
import { actions, selectors } from '../../../../redux/modules/mdb';
import { selectors as playlist } from '../../../../redux/modules/playlist';
import ButtonDayPicker from '../../../Filters/components/Date/ButtonDayPicker';
import { canonicalLink } from '../../../../helpers/links';
import { DeviceInfoContext } from '../../../../helpers/app-contexts';
import { isEmpty } from '../../../../helpers/utils';
import { getEmbedFromQuery, EMBED_TYPE_PLAYER, EMBED_TYPE_PLAYLIST } from '../../../../helpers/player';

const LessonDatePicker = ({ t }) => {
  const { isMobileDevice } = useContext(DeviceInfoContext);

  const navigate = useNavigate();
  const location = useLocation();
  const uiLang   = useSelector(state => settings.getUILang(state.settings));
  const { type } = getEmbedFromQuery(location);

  const { cId }      = useSelector(state => playlist.getInfo(state.playlist));
  const collection   = useSelector(state => selectors.getDenormCollectionWUnits(state.mdb, cId)) || false;
  const dpId         = useSelector(state => selectors.getDatepickerCO(state.mdb));
  const dpCollection = useSelector(state => selectors.getDenormCollectionWUnits(state.mdb, dpId)) || false;

  const dispatch = useDispatch();
  if (!isEmpty(dpCollection?.content_units) && collection.id !== dpCollection.id) {
    const to = canonicalLink(dpCollection.content_units[0]);
    if (type === EMBED_TYPE_PLAYLIST) {
      to.search = 'embed=2';
    }

    navigate({ ...to, pathname: `/${uiLang}${to.pathname}` });
    dispatch(actions.nullDatepickerCO());
  }

  /*
  useEffect(() => {
    if (!isEmpty(dpCollection?.content_units) && collection.id !== dpCollection.id) {
      const to = canonicalLink(dpCollection.content_units[0]);
      to.search = to.search.length > 0 ? `${to.search}&e`
      navigate({ ...to, pathname: `/${uiLang}${to.pathname}` });
      dispatch(actions.nullDatepickerCO());
    }
  }, [collection, dpCollection, uiLang, navigate, dispatch]);
*/
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

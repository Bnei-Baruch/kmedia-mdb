import React, { useEffect } from 'react';
import { useHistory } from 'react-router';
import { withNamespaces } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';

import * as shapes from '../../../../shapes';
import { DATE_FORMAT } from '../../../../../helpers/consts';
import { selectors as settings } from '../../../../../redux/modules/settings';
import { actions, selectors } from '../../../../../redux/modules/mdb';
import ButtonDayPicker from '../../../../Filters/components/Date/ButtonDayPicker';
import { canonicalLink } from '../../../../../helpers/links';

const CollectionDatePicker = ({ collection }) => {

  const { film_date, id } = collection;
  const history           = useHistory();
  const dispatch          = useDispatch();

  const language = useSelector(state => settings.getLanguage(state.settings));
  const coID     = useSelector(state => selectors.getDatepickerCO(state.mdb));
  const co       = useSelector(state => selectors.getDenormCollectionWUnits(state.mdb, coID));

  useEffect(() => {
    if (co && co.id !== id) {
      const link = canonicalLink(co.content_units[0]);
      history.push(`/${language}${link}`);
      dispatch(actions.nullDatepickerCO());
    }
  }, [coID]);

  const fetchNextCO = date => {
    const filmDate = moment.utc(date);
    dispatch(actions.fetchDatepickerCO({
      start_date: filmDate.format(DATE_FORMAT),
      end_date: filmDate.format(DATE_FORMAT)
    }));
  };

  return (
    <ButtonDayPicker
      label={film_date}
      language={language}
      onDayChange={fetchNextCO}
      value={Date.parse(film_date)}
      withLabel={true}
    />
  );
};

CollectionDatePicker.propTypes = {
  collection: shapes.GenericCollection.isRequired
};

export default CollectionDatePicker;

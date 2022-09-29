import React, { useContext, useEffect, useState } from 'react';
import { useSelector, shallowEqual, useDispatch } from 'react-redux';
import { withNamespaces } from 'react-i18next';
import { Header, Icon } from 'semantic-ui-react';

import { selectors as settings } from '../../../../redux/modules/settings';
import { getLanguageDirection } from '../../../../helpers/i18n-utils';
import { DeviceInfoContext } from '../../../../helpers/app-contexts';
import Link from '../../../Language/MultiLanguageLink';
import CollectionDatePicker from './LessonDatePicker';
import { selectors as mdb, actions } from '../../../../redux/modules/mdb';
import { selectors } from '../../../../redux/modules/playlist';
import { canonicalLink } from '../../../../helpers/links';
import moment from 'moment';
import { DATE_FORMAT } from '../../../../helpers/consts';

const getStartEndByFilmDate = (d) => {
  const filmDate = moment.utc(d);
  return (
    {
      start_date: filmDate.subtract(5, 'days').format(DATE_FORMAT),
      end_date: filmDate.add(10, 'days').format(DATE_FORMAT)
    }
  );
};

const LessonDatePickerContainer = ({ t }) => {
  const [prevLink, setPrevLink] = useState(null);
  const [nextLink, setNextLink] = useState(null);

  const { isMobileDevice } = useContext(DeviceInfoContext);

  const wipMap  = useSelector(state => mdb.getWip(state.mdb), shallowEqual);
  const cWindow = useSelector(state => mdb.getWindow(state.mdb), shallowEqual);

  const { cId }  = useSelector(state => selectors.getInfo(state.playlist));
  const denorm   = useSelector(state => mdb.nestedGetDenormCollection(state.mdb));
  const language = useSelector(state => settings.getLanguage(state.settings));
  const langDir  = getLanguageDirection(language);

  const dispatch = useDispatch();
  useEffect(() => {
    const idx = cWindow?.data?.indexOf(cId) || -1;
    if (idx < 1 && !wipMap.cWindow[cId]) {
      const { film_date }            = denorm(cId);
      const { start_date, end_date } = getStartEndByFilmDate(film_date);
      dispatch(actions.fetchWindow({ id: cId, start_date, end_date }));
    }
  }, [cId, denorm, cWindow, wipMap.cWindow]);

  useEffect(() => {
    if (cWindow.data && cWindow.data.length > 0) {
      const curIndex       = cWindow.data.indexOf(cId);
      const prevCollection = curIndex < cWindow.data.length - 1 ? denorm(cWindow.data[curIndex + 1]) : null;
      const prevLnk        = prevCollection ? canonicalLink(prevCollection) : null;
      setPrevLink(prevLnk);

      const nextCollection = curIndex > 0 ? denorm(cWindow.data[curIndex - 1]) : null;
      const nextLnk        = nextCollection ? canonicalLink(nextCollection) : null;
      setNextLink(nextLnk);
    }

  }, [cId, cWindow.data, denorm]);

  const isLtr = langDir === 'ltr';
  return (
    <Header.Subheader
      className={isMobileDevice ? '' : isLtr ? 'float-right' : 'float-left'}
    >
      {
        !!prevLink && (
          <Link
            to={prevLink}
            className="avbox__playlist-prev-button"
            title={t('buttons.previous-lesson')}
          >
            <Icon size="large" name={`triangle ${isLtr ? 'left' : 'right'}`} />
          </Link>
        )
      }
      <CollectionDatePicker />
      {
        !nextLink ? (
          <span className="avbox__playlist-next-button">
            <Icon disabled size="large" name={`triangle ${isLtr ? 'right' : 'left'}`} />
          </span>
        ) : (
          <Link
            to={nextLink}
            className="avbox__playlist-next-button"
            title={t('buttons.next-lesson')}
          >
            <Icon size="large" name={`triangle ${isLtr ? 'right' : 'left'}`} />
          </Link>

        )
      }
    </Header.Subheader>
  );
};

export default withNamespaces()(LessonDatePickerContainer);

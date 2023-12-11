import React, { useContext, useEffect } from 'react';
import { useSelector, shallowEqual, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Header, Icon } from 'semantic-ui-react';

import { selectors as settings } from '../../../../redux/modules/settings';
import { DeviceInfoContext } from '../../../../helpers/app-contexts';
import Link from '../../../Language/MultiLanguageLink';
import CollectionDatePicker from './LessonDatePicker';
import { selectors as mdb, actions } from '../../../../redux/modules/mdb';
import { selectors } from '../../../../redux/modules/playlist';
import moment from 'moment';
import { DATE_FORMAT } from '../../../../helpers/consts';
import { canonicalLink } from '../../../../helpers/links';
import { useLocation } from 'react-router-dom';
import { getEmbedFromQuery, EMBED_TYPE_PLAYLIST } from '../../../../helpers/player';

const getStartEndByFilmDate = d => {
  const filmDate = moment.utc(d);
  return (
    {
      start_date: filmDate.subtract(5, 'days').format(DATE_FORMAT),
      end_date: filmDate.add(10, 'days').format(DATE_FORMAT)
    }
  );
};

const LessonDatePickerContainer = () => {
  const { isMobileDevice } = useContext(DeviceInfoContext);
  const { t }              = useTranslation();

  const wipMap  = useSelector(state => mdb.getWip(state.mdb), shallowEqual);
  const cWindow = useSelector(state => mdb.getWindow(state.mdb), shallowEqual);

  const cId    = useSelector(state => selectors.getInfo(state.playlist).cId);
  const denorm = useSelector(state => mdb.nestedGetDenormCollection(state.mdb));
  const uiDir  = useSelector(state => settings.getUIDir(state.settings));

  const location = useLocation();
  const { type } = getEmbedFromQuery(location);

  const dispatch = useDispatch();
  const curIndex = cWindow?.data?.indexOf(cId) ?? -1;
  useEffect(() => {
    if (curIndex < 1 && !wipMap.cWindow[cId] && cId !== cWindow.id) {
      const { film_date }            = denorm(cId);
      const { start_date, end_date } = getStartEndByFilmDate(film_date);
      dispatch(actions.fetchWindow({ id: cId, start_date, end_date }));
    }
  }, [cId, cWindow, wipMap.cWindow, curIndex]);

  const isLtr          = uiDir === 'ltr';
  const prevCollection = curIndex >= 0 && curIndex < cWindow.data.length - 1 ? denorm(cWindow.data[curIndex + 1]) : null;
  const nextCollection = curIndex > 0 ? denorm(cWindow.data[curIndex - 1]) : null;

  const prevTo = prevCollection ? canonicalLink(prevCollection) : null;
  const nextTo = nextCollection ? canonicalLink(nextCollection) : null;
  if (type === EMBED_TYPE_PLAYLIST) {
    if (prevTo) prevTo.search = 'embed=2';
    if (nextTo) nextTo.search = 'embed=2';
  }
  return (
    <Header.Subheader
      className={isMobileDevice ? '' : isLtr ? 'float-right' : 'float-left'}
    >
      {
        !!prevTo && (
          <Link
            to={prevTo}
            className="avbox__playlist-prev-button"
            title={t('buttons.previous-lesson')}
          >
            <Icon size="large" name={`triangle ${isLtr ? 'left' : 'right'}`} />
          </Link>
        )
      }
      <CollectionDatePicker />
      {
        !nextTo ? (
          <span className="avbox__playlist-next-button">
            <Icon disabled size="large" name={`triangle ${isLtr ? 'right' : 'left'}`} />
          </span>
        ) : (
          <Link
            to={nextTo}
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

export default LessonDatePickerContainer;

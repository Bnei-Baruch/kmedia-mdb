import React from 'react';
import PropTypes from 'prop-types';
import { withNamespaces } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Button, Header, List } from 'semantic-ui-react';

import {
  CT_CLIP, CT_CONGRESS,
  CT_DAILY_LESSON, CT_KTAIM_NIVCHARIM,
  CT_LECTURE,
  CT_LESSON_PART, CT_LESSONS_SERIES,
  CT_SPECIAL_LESSON, CT_VIDEO_PROGRAM_CHAPTER,
  CT_VIRTUAL_LESSON,
  CT_WOMEN_LESSON
} from '../../../../../helpers/consts';
import { canonicalLink } from '../../../../../helpers/links';
import { intersperse, tracePath } from '../../../../../helpers/utils';
import { stringify as urlSearchStringify } from '../../../../../helpers/url';
import { selectors as sourcesSelectors } from '../../../../../redux/modules/sources';
import { selectors as tagsSelectors } from '../../../../../redux/modules/tags';
import { filtersTransformer } from '../../../../../filters/index';
import Link from '../../../../Language/MultiLanguageLink';
import * as shapes from '../../../../shapes';
import PersonalInfo from './PersonalInfo';

const filterLessons = (ct, filmDate) => {
  switch (ct) {
    case CT_LESSON_PART:
      if (filmDate && filmDate > '1980-01-01') {
        return '/daily';
      }

      // dirty hack to determine if rabash lesson
      // a better way would use MDB data (require backend api support)
      return '/rabash';

    case CT_VIRTUAL_LESSON:
      return '/virtual';
    case CT_LECTURE:
      return '/lectures';
    case CT_WOMEN_LESSON:
      return '/women';
    // case CT_CHILDREN_LESSON:
    //   return '/children';
    default:
      return '';
  }
};

const makeTagLinks = (tags = [], getTagById) =>
  Array.from(intersperse(
    tags.map(x => {
      const { id, label } = getTagById(x);
      if (!label) {
        return '';
      }

      return <Link key={id} to={`/topics/${id}`}>
        <Button basic size="tiny" className="link_to_cu">
          {label}
        </Button>
      </Link>;
    }), ''));

const makeSourcesLinks = (sources = [], getSourceById, filteredListPath) => Array.from(intersperse(
  sources.map(x => {
    const source = getSourceById(x);
    if (!source) {
      return '';
    }

    const path    = tracePath(source, getSourceById);
    const display = path.map(y => y.name).join(' > ');

    if (filteredListPath) {
      const query = filtersTransformer.toQueryParams([
        { name: 'sources-filter', values: [path.map(y => y.id)] }
      ]);

      return (
        <Link
          key={x}
          to={{
            pathname: `/${filteredListPath}`,
            search: urlSearchStringify(query)
          }}
        >
          {display}
        </Link>
      );
    }

    return <span key={x}>{display}</span>;
  }), ', '));

const makeCollectionsLinks = (collections = {}, t, currentCollection) => {
  // filter out the current collection
  const colValues           = Object.values(collections);
  const collectionsForLinks = currentCollection
    ? colValues.filter(col => col.id !== currentCollection.id)
    : colValues;

  return Array.from(intersperse(
    collectionsForLinks.map(x => {
      let display;
      switch (x.content_type) {
        case CT_DAILY_LESSON:
        case CT_SPECIAL_LESSON: {
          const ctLabel = t(`constants.content-types.${CT_DAILY_LESSON}`);
          const fd      = t('values.date', { date: x.film_date });
          display       = `${ctLabel} ${fd}`;
          break;
        }

        default:
          display = x.name;
          break;
      }

      return <Link key={x.id} to={canonicalLink(x)}>{display}</Link>;
    }), ', '));
};

const getEpisodeName = (ct, episode, t) => {
  const tName = [CT_VIDEO_PROGRAM_CHAPTER, CT_CLIP].find(x => x === ct) ? 'pages.unit.info.episode' : 'pages.unit.recommended.same-collection.item-title';
  return t(tName, { name: episode });
};

const getEpisodeInfo = (ct, cIDs, currentCollection, filmDate, t) => {
  const cIds        = cIDs && Object.keys(cIDs);
  const cId         = cIds && (currentCollection ? cIds.find(c => c.split('_')[0] === currentCollection.id) : cIds[0]);
  const showEpisode = cId && cId.indexOf(CT_KTAIM_NIVCHARIM) === -1;
  const episode     = showEpisode && cId.split('_').slice(-1).pop();
  const episodeInfo = [];
  if (episode && episode !== '0')
    episodeInfo.push(getEpisodeName(ct, episode, t));
  episodeInfo.push(t('values.date', { date: filmDate }));
  const len = episodeInfo.length - 1;
  return episodeInfo.map((x, i) => {
    return (
      <span>
        {x}
        {i < len && (<span className="seperator">|</span>)}
      </span>
    );
  });
};

const Info = ({ unit = {}, section = '', t, currentCollection = null }) => {
  const getSourceById = useSelector(state => sourcesSelectors.getSourceById(state.sources));
  const getTagById    = useSelector(state => tagsSelectors.getTagById(state.tags));

  const { name, film_date: filmDate, sources, tags, collections, content_type: ct, cIDs } = unit;

  // take lessons section tabs into consideration
  let filteredListPath = section;
  if (filteredListPath === 'lessons') {
    filteredListPath += filterLessons(ct, filmDate);
  }

  const tagLinks         = makeTagLinks(tags, getTagById);
  const sourcesLinks     = makeSourcesLinks(sources, getSourceById, filteredListPath);
  const collectionsLinks = makeCollectionsLinks(collections, t, currentCollection);
  const isMultiLessons   = Object.values(collections).some(col => col.content_type === CT_LESSONS_SERIES || col.content_type === CT_CONGRESS);
  const episodeInfo      = getEpisodeInfo(ct, cIDs, currentCollection, filmDate, t);

  return (
    <>
      <PersonalInfo collection={currentCollection} unit={unit} />
      <div className="unit-info">
        {
          !isMultiLessons && collectionsLinks.length > 0 && (
            <List.Item className="unit-info__collections">
              {collectionsLinks}
            </List.Item>
          )
        }
        <Header as="h2" className="unit-info__header">
          <span className="unit-info__name">{name}</span>
        </Header>

        <div className="text grey unit-info__film-date">
          {episodeInfo}
        </div>

        <List>
          {
            tagLinks.length > 0 && (
              <List.Item className="unit-info__topics">
                {tagLinks}
              </List.Item>
            )
          }
          {
            sourcesLinks.length > 0 && (
              <List.Item className="unit-info__sources">
                <strong>
                  {t('pages.unit.info.sources')}
                  :
                </strong>
                &nbsp;
                {sourcesLinks}
              </List.Item>
            )
          }
          {
            isMultiLessons && collectionsLinks.length > 0 && (
              <List.Item>
                <strong>
                  {t('pages.unit.info.collections')}
                  :
                </strong>
                &nbsp;
                {collectionsLinks}
              </List.Item>
            )
          }
        </List>
      </div>
    </>
  );
};

Info.propTypes = {
  unit: shapes.ContentUnit,
  section: PropTypes.string,
};

export default withNamespaces()(Info);

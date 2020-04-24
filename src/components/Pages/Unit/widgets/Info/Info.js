import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { connect, useSelector } from 'react-redux';
import { Header, List } from 'semantic-ui-react';

import { CT_DAILY_LESSON, CT_LECTURE, CT_LESSON_PART, CT_SPECIAL_LESSON, CT_VIRTUAL_LESSON, CT_WOMEN_LESSON } from '../../../../../helpers/consts';
import { canonicalLink } from '../../../../../helpers/links';
import { intersperse, tracePath } from '../../../../../helpers/utils';
import { stringify as urlSearchStringify } from '../../../../../helpers/url';
import { selectors as sourcesSelectors } from '../../../../../redux/modules/sources';
import { selectors as tagsSelectors } from '../../../../../redux/modules/tags';
import { filtersTransformer } from '../../../../../filters/index';
import * as shapes from '../../../../shapes';
import Link from '../../../../Language/MultiLanguageLink';

const filterLessons = (ct, filmDate) => {
  switch (ct) {
  case CT_LESSON_PART:
    if (filmDate && filmDate > '1980-01-01') {
      return '/daily';
    } else {
      // dirty hack to determine if rabash lesson
      // a better way would use MDB data (require backend api support)
      return '/rabash';
    }
  case CT_VIRTUAL_LESSON:
    return '/virtual';
  case CT_LECTURE:
    return '/lectures';
  case CT_WOMEN_LESSON:
    return '/women';
    // case CT_CHILDREN_LESSON:
    //   filteredListPath += '/children';
    //   break;
  default:
    return '';
  }
};

const makeTagLinks = (tags, getTagById, filteredListPath) => {
  return Array.from(intersperse(
    (tags || []).map((x) => {
      const tag = getTagById(x);
      if (!tag) {
        return '';
      }

      const path    = tracePath(tag, getTagById);
      const display = path[path.length - 1].label;

      if (filteredListPath) {
        const query = filtersTransformer.toQueryParams([
          { name: 'topics-filter', values: [path.map(y => y.id)] }
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
};

const makeSourceLinks = (sources, getSourceById, filteredListPath) => {
  return Array.from(intersperse(
    (sources || []).map((x) => {
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
};

const makeCollectionsLinks = (collections, t) => {
  return Array.from(intersperse(
    (Object.values(collections || {}) || []).map((x) => {
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

const Info = (unit = {}, section = '') => {
  const { t }         = useTranslation('common', { useSuspense: false });
  const getSourceById = useSelector(state => sourcesSelectors.getSourceById(state.sources));
  const getTagById    = useSelector(state => tagsSelectors.getTagById(state.tags));

  const { name, film_date: filmDate, sources, tags, collections, content_type: ct } = unit;

  // take lessons section tabs into consideration
  let filteredListPath = section;
  if (filteredListPath === 'lessons') {
    filteredListPath += filterLessons(ct, filmDate);
  }

  const tagLinks = makeTagLinks(tags, getTagById, filteredListPath);

  const sourcesLinks = makeSourceLinks(sources, getSourceById, filteredListPath);

  const collectionsLinks = makeCollectionsLinks(collections);

  return (
    <div className="unit-info">
      <Header as="h1">
        <small className="text grey unit-info__film-date">
          {t('values.date', { date: filmDate })}
        </small>
        <br />
        <span className="unit-info__name">{name}</span>
      </Header>
      <List>
        {
          tagLinks.length && (
            <List.Item className="unit-info__topics">
              <strong>
                {t('pages.unit.info.topics')}
                :
              </strong>
              &nbsp;
              {tagLinks}
            </List.Item>
          )
        }
        {
          sourcesLinks.length && (
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
          collectionsLinks.length && (
            <List.Item className="unit-info__collections">
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
  );
};

Info.propTypes = {
  unit: shapes.ContentUnit,
  section: PropTypes.string,
};

export default connect(
  state => ({
    getSourceById: sourcesSelectors.getSourceById(state.sources),
    getTagById: tagsSelectors.getTagById(state.tags),
  })
)(Info);

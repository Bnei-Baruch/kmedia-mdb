import React from 'react';
import PropTypes from 'prop-types';
import { withNamespaces } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Button, Header, List } from 'semantic-ui-react';

import {
  CT_CONGRESS,
  CT_DAILY_LESSON,
  CT_KTAIM_NIVCHARIM,
  CT_LESSONS_SERIES,
  CT_SPECIAL_LESSON,
} from '../../../../../helpers/consts';
import { canonicalLink } from '../../../../../helpers/links';
import { cuPartNameByCCUType, intersperse } from '../../../../../helpers/utils';
import { selectors as tagsSelectors } from '../../../../../redux/modules/tags';
import Link from '../../../../Language/MultiLanguageLink';
import * as shapes from '../../../../shapes';
import PersonalInfo from './PersonalInfo';
import { selectors as recommended } from '../../../../../redux/modules/recommended';
import UnitLogo from '../../../../shared/Logo/UnitLogo';

export const makeTagLinks = (tags = [], getTagById) =>
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

const makeCollectionsLinks = (collections = {}, currentCollection) => {
  // filter out the current collection
  const colValues           = Object.values(collections).filter(c => ![CT_DAILY_LESSON, CT_SPECIAL_LESSON].includes(c.content_type));
  const collectionsForLinks = currentCollection
    ? colValues.filter(col => col.id !== currentCollection.id)
    : colValues;

  const noSSeries = Array.from(intersperse(
    collectionsForLinks.filter(c => c.content_type !== CT_LESSONS_SERIES).map(x =>
      <Link key={x.id} to={canonicalLink(x)}>{x.name}</Link>), ', '));

  const sSeries = Array.from(intersperse(
    collectionsForLinks.filter(c => c.content_type === CT_LESSONS_SERIES).map(x =>
      <Link key={x.id} to={canonicalLink(x)}>{x.name}</Link>), ', '));
  return { noSSeries, sSeries };
};

const getEpisodeInfo = (cIDs, currentCollection, filmDate, t) => {
  const cIds        = cIDs && Object.keys(cIDs);
  const cId         = cIds && (currentCollection ? cIds.find(c => c.split('_')[0] === currentCollection.id) : cIds[0]);
  const showEpisode = cId && cId.indexOf(CT_KTAIM_NIVCHARIM) === -1;
  const episode     = showEpisode && cId.split('_').slice(-1).pop();
  const episodeInfo = [];
  if (episode && episode !== '0' && (currentCollection && ![CT_DAILY_LESSON, CT_SPECIAL_LESSON].includes(currentCollection.content_type)))
    episodeInfo.push(t(cuPartNameByCCUType(currentCollection.content_type), { name: episode }));
  episodeInfo.push(t('values.date', { date: filmDate }));
  const len = episodeInfo.length - 1;
  return episodeInfo.map((x, i) => (
    <span key={i}>
      {x}
      {i < len && (<span className="separator">|</span>)}
    </span>
  ));
};

const Info = ({ unit = {}, t, currentCollection = null }) => {

  const getTagById = useSelector(state => tagsSelectors.getTagById(state.tags));

  const { id, name, film_date: filmDate, tags, collections, cIDs } = unit;

  const views = useSelector(state => recommended.getViews(id, state.recommended));

  const tagLinks               = makeTagLinks(tags || [], getTagById);
  const { noSSeries, sSeries } = makeCollectionsLinks(collections, currentCollection);
  const isMultiLessons         = Object.values(collections).some(col => col.content_type === CT_LESSONS_SERIES || col.content_type === CT_CONGRESS);
  const episodeInfo            = getEpisodeInfo(cIDs, currentCollection || Object.values(collections)[0], filmDate, t);
  const ccu =  Object.values(collections)[0];
  return (
    <>
      <PersonalInfo collection={currentCollection} unit={unit} />
      <div className="unit-info">
        {
          !isMultiLessons && noSSeries.length > 0 && (
            <>
              <div className="unit-info__title">
                <UnitLogo collectionId={ccu.id} circular fallbackImg="none" />
                <List.Item className="unit-info__collections" key="collections">
                  {noSSeries}
                </List.Item>
              </div>
            </>
          )
        }
        <Header as="h2" className="unit-info__header">
          <div className="unit-info__name">{name}</div>
        </Header>

        <div className="text grey unit-info__film-date">
          {episodeInfo}
          {
            (views > 0) && (
              <span key="views">
                <span className="separator">|</span>
                {t('pages.unit.info.views', { views })}
              </span>
            )
          }
        </div>

        <List>
          {
            tagLinks.length > 0 && (
              <List.Item className="unit-info__topics" key="topics">
                {tagLinks}
              </List.Item>
            )
          }
          {
            sSeries.length > 0 && (
              <List.Item key="co-links-series" className="margin-top-8">
                <strong>
                  {`${t('pages.unit.info.study-series')}: `}
                </strong>
                {sSeries}
              </List.Item>
            )
          }
          {
            isMultiLessons && noSSeries.length > 0 && (
              <List.Item key="co-links" className="margin-top-8">
                <strong>
                  {`${t('pages.unit.info.collections')}: `}
                </strong>
                {noSSeries}
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
  currentCollection: shapes.Collection
};

export default withNamespaces()(Info);

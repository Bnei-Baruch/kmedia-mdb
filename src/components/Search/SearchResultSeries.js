import React from 'react';
import { connect } from 'react-redux';
import { Button, Container, Icon, Segment } from 'semantic-ui-react';

import { selectors as lessonsSelectors } from '../../redux/modules/lessons';
import { selectors as mdbSelectors } from '../../redux/modules/mdb';
import { selectors as tagSelectors } from '../../redux/modules/tags';
import { isDebMode } from '../../helpers/url';
import Link from '../Language/MultiLanguageLink';
import ScoreDebug from './ScoreDebug';
import SearchResultBase from './SearchResultBase';
import { CT_LESSONS_SERIES } from '../../helpers/consts';
import SearchResultCollection from './SearchResultCollection';

class SearchResultSeries extends SearchResultBase {
  renderSerie = s => {
    const { t } = this.props;
    const { logLinkParams } = this.buildCollectionLinkParams(s);

    return (
      <Button basic size="tiny" className="link_to_cu">
        {s.name}
        <Link
          key={s.id}
          onClick={() => this.logClick(...logLinkParams)}
          to={`/lessons/series/c/${s.id}`}
        >
          <span className="margin-right-8 margin-left-8">
            <Icon name="tasks" size="small"/>
            {`${t('search.showAll')} ${s.cuIDs.length} ${t('pages.collection.items.lessons-collection')}`}
          </span>
        </Link>
      </Button>
    );
  };

  buildCollectionLinkParams = c => {
    const { queryResult: { search_result: { searchId } }, hit, rank, filters } = this.props;
    const { _index: index, _source: { mdb_uid: mdbUid, result_type: resultType }, } = hit;

    return {
      canonicalLinkParams: [{ id: c.id, content_type: 'CT_LECTURE_SERIES' }, this.getMediaLanguage(filters)],
      logLinkParams: [mdbUid, index, resultType, rank, searchId]
    };
  };

  getLowestLevelSeries = (series, rootId) => {
    if (series.length <= 1)
      return series[0];
    const root = series.find(s => s.parent_id === rootId || (!s.parent_id && !rootId));
    if (!(root?.children?.length !== 0)) {
      return root;
    }

    return this.getLowestLevelSeries(series, root.id);
  };

  render() {
    const {
      t,
      location,
      hit,
      getSerieBySource,
      getSerieByTag,
      nestedDenormCollectionWUnits,
      getTagById,
      wip: { lectures: wipL, series: wipS }
    } = this.props;

    if (wipL || wipS) {
      return null;
    }

    const isByTag = hit._type === 'lessons_series_by_tag'
    const getSerie = isByTag ? getSerieByTag : getSerieBySource

    const { _score: score, _uid } = hit;
    if (!_uid) {
      return null;
    }

    const series = _uid.split('_').map(getSerie);
    const s = this.getLowestLevelSeries(series);
    if (s?.collections.length === 1) {
      const c = nestedDenormCollectionWUnits(s.collections[0].id)
      return (
        <SearchResultCollection c={c} {...this.props} />
      )
    }

    const { logLinkParams } = this.buildLinkParams();
    const title = isByTag ? getTagById(_uid)?.label : s.name;

    return (
      <Segment className="bg_hover_grey search__block">
        <Container>
          <Container>
            <Container as="h3">
              {<Link
                className="search__link"
                onClick={() => this.logClick(...logLinkParams)}
                to={'/lessons/series'}
              >
                {title}
              </Link>}
            </Container>

            <Container className="content">
              {this.iconByContentType(CT_LESSONS_SERIES, t, true)}
            </Container>
            <div className="clear"/>
          </Container>

          <Container className="content clear margin-top-8">
            {s.collections.slice(0, 5).map(this.renderSerie)}

            <Link
              onClick={() => this.logClick(...logLinkParams)}
              to={`/lessons/series`}
              className="margin-right-8"
            >
              <Icon name="tasks" size="small"/>
              {`${t('search.showAll')} ${s.collections.length} ${t('pages.collection.items.lessons-collection')}`}
            </Link>
          </Container>
        </Container>
        {
          !isDebMode(location)
            ? null
            : (
              <Container collapsing>
                <ScoreDebug name={s.name} score={score} explanation={hit._explanation}/>
              </Container>
            )
        }
      </Segment>
    );
  }
}

export default connect(state => ({
  getSerieBySource: lessonsSelectors.getSerieBySourceId(state.lessons, state.mdb, state.sources),
  getSerieByTag: lessonsSelectors.getSerieByTagId(state.lessons, state.mdb, state.tags),
  nestedDenormCollectionWUnits: mdbSelectors.nestedDenormCollectionWUnits(state.mdb),
  getTagById: tagSelectors.getTagById(state.tags),
  wip: lessonsSelectors.getWip(state.lessons)
}))(SearchResultSeries);

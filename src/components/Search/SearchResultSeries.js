import React from 'react';
import { Button, Container, Icon, Segment } from 'semantic-ui-react';

import { actions as lessonsActions, selectors as lessonsSelectors } from '../../redux/modules/lessons';
import { canonicalLink } from '../../helpers/links';
import { isDebMode } from '../../helpers/url';
import Link from '../Language/MultiLanguageLink';
import ScoreDebug from './ScoreDebug';
import SearchResultBase from './SearchResultBase';
import { CT_COMBINED_LESSONS_SERIES } from '../../helpers/consts';
import { connect } from 'react-redux';
import { selectors as sourcesSelectors } from '../../redux/modules/sources';

class SearchResultSeries extends SearchResultBase {
  renderSerie = s => {
    const { t }                                  = this.props;
    const { canonicalLinkParams, logLinkParams } = this.buildCollectionLinkParams(s);

    return (
      <Button basic size="tiny" className="link_to_cu">
        {s.name}
        <Link
          key={s.id}
          onClick={() => this.logClick(...logLinkParams)}
          to={`/lessons/series/c/${s.id}`}
        >
          <span className="margin-right-8 margin-left-8">
            <Icon name="tasks" size="small" />
            {`${t('search.showAll')} ${s.cuIDs.length} ${t('pages.collection.items.lessons-collection')}`}
          </span>
        </Link>
      </Button>
    );
  };

  buildCollectionLinkParams = (c) => {
    const { queryResult: { search_result: { searchId } }, hit, rank, filters }      = this.props;
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
    const { t, location, hit, getSerieBySource, wip: { lectures: wipL, series: wipS } } = this.props;

    if (wipL || wipS) {
      return null;
    }

    const { _score: score, _uid } = hit;
    if (!_uid) {
      return null;
    }

    const series = _uid.split('_').map(getSerieBySource);
    const s      = this.getLowestLevelSeries(series);

    const { logLinkParams } = this.buildLinkParams();

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
                {s.name}
              </Link>}
            </Container>

            <Container className="content">
              {this.iconByContentType(CT_COMBINED_LESSONS_SERIES, t, true)}
            </Container>
            <div className="clear" />
          </Container>

          <Container className="content clear margin-top-8">
            {s.collections.slice(0, 5).map(this.renderSerie)}

            <Link
              onClick={() => this.logClick(...logLinkParams)}
              to={`/lessons/series`}
              className="margin-right-8"
            >
              <Icon name="tasks" size="small" />
              {`${t('search.showAll')} ${s.collections.length} ${t('pages.collection.items.lessons-collection')}`}
            </Link>
          </Container>
        </Container>
        {
          !isDebMode(location)
            ? null
            : (
              <Container collapsing>
                <ScoreDebug name={s.name} score={score} explanation={hit._explanation} />
              </Container>
            )
        }
      </Segment>
    );
  }
}

export default connect(state => ({
  getSerieBySource: lessonsSelectors.getSerieBySourceId(state.lessons, state.mdb, state.sources),
  wip: lessonsSelectors.getWip(state.lessons)
}))(SearchResultSeries);

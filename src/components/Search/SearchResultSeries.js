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
import { CT_LESSONS_SERIES, SEARCH_INTENT_HIT_TYPE_SERIES_BY_TAG } from '../../helpers/consts';
import SearchResultCollection from './SearchResultCollection';
import { canonicalLink } from '../../helpers/links';

class SearchResultSeries extends SearchResultBase {
  state = {
    showAll: false,
  };

  renderSerie = s => {
    const { t }                                  = this.props;
    const { logLinkParams, canonicalLinkParams } = this.buildCollectionLinkParams(s);

    return (
      <Button basic size="tiny" className="link_to_cu">
        {s.name}
        <Link
          key={s.id}
          onClick={() => this.logClick(...logLinkParams)}
          to={canonicalLink(...canonicalLinkParams)}
        >
          <span className="margin-right-8 margin-left-8">
            <Icon name="tasks" size="small" />
            {`${t('search.showAll')} ${s.cuIDs.length} ${t('pages.collection.items.lessons-collection')}`}
          </span>
        </Link>
      </Button>
    );
  };

  buildCollectionLinkParams = c => {
    const { queryResult: { search_result: { searchId } }, hit, rank, filters }      = this.props;
    const { _index: index, _source: { mdb_uid: mdbUid, result_type: resultType }, } = hit;

    return {
      canonicalLinkParams: [{ id: c.id, content_type: CT_LESSONS_SERIES }, this.getMediaLanguage(filters)],
      logLinkParams: [mdbUid, index, resultType, rank, searchId]
    };
  };

  // Reduce series from all leaf tags/sources.
  getLowestLevelSeries = (series, rootId) => {
    if (!series || !series.length) return null;
    const root = series.find(s => s.parent_id === rootId || (!s.parent_id && !rootId));
    if (root && root.children && root.children.length) {
      return root;
    }

    if (!root) return series[series.length - 1];
    return this.getLowestLevelSeries(series, root.id);
  };

  handleToggle = () => this.setState({ showAll: !this.state.showAll });

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

    const { showAll } = this.state;

    if (wipL || wipS) {
      return null;
    }

    const isByTag  = hit._type === SEARCH_INTENT_HIT_TYPE_SERIES_BY_TAG;
    const getSerie = isByTag ? getSerieByTag : getSerieBySource;

    const { _score: score, _uid, _source: { mdb_uid } } = hit;
    if (!_uid) {
      return null;
    }

    // _uid is tags/sources uids separated by '_' (because tags/sources have tree build)
    // We need all series that connected to the lowest level of tags/sources, e.g., that don't have parent id.
    // TODO: https://issues.kbb1.com/issue/AS-142
    const series = _uid.split('_').map(getSerie);
    const s      = this.getLowestLevelSeries(series);
    if (!s) return null;
    if (s.collections.length === 1) {
      const c = nestedDenormCollectionWUnits(s.collections[0].id);
      return (
        <SearchResultCollection c={c} {...this.props} />
      );
    }

    const title       = isByTag ? getTagById(_uid)?.label : s.name;
    const collecitons = s.collections.filter(c => c.id !== mdb_uid);
    collecitons.unshift(s.collections.find(c => c.id === mdb_uid));
    return (
      <Segment className="bg_hover_grey search__block">
        <Container>
          <Container>
            <Container as="h3" content={title} />
            <Container className="content">
              {this.iconByContentType(CT_LESSONS_SERIES, t, true)}
            </Container>
            <div className="clear" />
          </Container>

          <Container className="content clear margin-top-8">
            {(showAll || collecitons.length < 5 ? collecitons : collecitons.slice(0, 5)).filter(c => !!c).map(this.renderSerie)}

            {
              (collecitons.length > 4) && (
                <Button
                  basic
                  icon={showAll ? 'minus' : 'plus'}
                  className="link_to_cu"
                  size="tini"
                  onClick={this.handleToggle}
                >
                  <Icon name={showAll ? 'minus' : 'plus'} size="small" />
                  {
                    showAll ?
                      t('topics.show-less')
                      : `${t('search.showAll')} ${s.collections.length} ${t('pages.collection.items.lessons-collection')}`
                  }
                </Button>
              )
            }
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
  getSerieByTag: lessonsSelectors.getSerieByTagId(state.lessons, state.mdb, state.tags),
  nestedDenormCollectionWUnits: mdbSelectors.nestedDenormCollectionWUnits(state.mdb),
  getTagById: tagSelectors.getTagById(state.tags),
  wip: lessonsSelectors.getWip(state.lessons)
}))(SearchResultSeries);

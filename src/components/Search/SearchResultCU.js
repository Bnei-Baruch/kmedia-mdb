import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Segment, Icon, Button, Image, } from 'semantic-ui-react';
import { bindActionCreators } from 'redux';

import { canonicalLink } from '../../helpers/links';
import { actions, selectors } from '../../redux/modules/mdb';
import { selectors as filterSelectors } from '../../redux/modules/filters';
import { selectors as sourcesSelectors } from '../../redux/modules/sources';
import * as shapes from '../shapes';
import Link from '../Language/MultiLanguageLink';
import SearchResultBase from './SearchResultBase';

class SearchResultCU extends SearchResultBase {
  static propTypes = {
    results: PropTypes.object,
    getSourcePath: PropTypes.func,
    areSourcesLoaded: PropTypes.bool.isRequired,
    queryResult: PropTypes.object,
    cMap: PropTypes.objectOf(shapes.Collection),
    cuMap: PropTypes.objectOf(shapes.ContentUnit),
    pageNo: PropTypes.number.isRequired,
    pageSize: PropTypes.number.isRequired,
    language: PropTypes.string.isRequired,
    wip: shapes.WIP,
    err: shapes.Error,
    t: PropTypes.func.isRequired,
    handlePageChange: PropTypes.func.isRequired,
    filters: PropTypes.array.isRequired,
    location: shapes.HistoryLocation.isRequired,
    click: PropTypes.func.isRequired,
    fetchUnit: PropTypes.func.isRequired,
  };

  static defaultProps = {
    queryResult: null,
    wip: false,
    err: null,
  };

  render() {
    const { t, queryResult, cu, hit, rank } = this.props;
    const { search_result: { searchId } }   = queryResult;
    const {
            _index: index,
            _source:
              {
                mdb_uid: mdbUid,
                result_type: resultType
              },
            highlight,
          }                                 = hit;

    let filmDate = '';
    if (cu.film_date) {
      filmDate = t('values.date', { date: cu.film_date });
    }

    return (
      <Segment key={mdbUid} className="bgHoverGrey search__block">
        <Link
          className="search__link content"
          onClick={() => this.click(mdbUid, index, resultType, rank, searchId)}
          to={canonicalLink(cu || { id: mdbUid, content_type: cu.content_type })}>
          {this.titleFromHighlight(highlight)}
        </Link>
        <div>
          {this.iconByContentType(cu.content_type, true)} | <strong>{filmDate}</strong>
          <div className="clear" />
        </div>

        <div className="content">
          {this.snippetFromHighlight(highlight)}
        </div>
        <div>
          {this.renderFiles(cu)}
          <div className="clear" />
        </div>
      </Segment>
    );
  };
}

const mapState = (state, ownProps) => {
  const { units: wip } = selectors.getWip(state.mdb);
  const { units: err } = selectors.getErrors(state.mdb);

  return {
    filters: filterSelectors.getFilters(state.filters, 'search'),
    areSourcesLoaded: sourcesSelectors.areSourcesLoaded(state.sources),
    wip: wip === {},
    err,
  };
};

const mapDispatch = dispatch => bindActionCreators({
  fetchUnit: actions.fetchUnit,
}, dispatch);

export default connect(mapState, mapDispatch)(SearchResultCU);

import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';
import { Segment, Icon, Button, Table, Image, Label } from 'semantic-ui-react';
import { bindActionCreators } from 'redux';
import moment from 'moment';

import playerHelper from '../../helpers/player';
import { canonicalLink, sectionLink } from '../../helpers/links';
import { formatDuration, tracePath } from '../../helpers/utils';
import { assetUrl, imaginaryUrl, Requests } from '../../helpers/Api';
import { isDebMode } from '../../helpers/url';
import { actions, selectors } from '../../redux/modules/mdb';
import { selectors as filterSelectors } from '../../redux/modules/filters';
import { selectors as sourcesSelectors } from '../../redux/modules/sources';
import { selectors as tagsSelectors } from '../../redux/modules/tags';
import * as shapes from '../shapes';
import UnitLogo from '../shared/Logo/UnitLogo';
import { sectionLogo } from '../../helpers/images';
import Link from '../Language/MultiLanguageLink';
import ScoreDebug from './ScoreDebug';
import {
  MT_TEXT,
  MT_AUDIO,
  MT_VIDEO,
  CT_LESSON_PART,
  SEARCH_INTENT_FILTER_NAMES,
  SEARCH_INTENT_NAMES,
  SEARCH_INTENT_SECTIONS,
  SEARCH_INTENT_INDEX_TOPIC,
  SEARCH_INTENT_INDEX_SOURCE,
  SEARCH_INTENT_HIT_TYPES,
} from '../../helpers/consts';

let testCall = true;

class SearchResultCU extends Component {
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
    cMap: {},
    cuMap: {},
    wip: false,
    err: null,
    getSourcePath: undefined,
  };

  componentWillMount() {
    const { fetchUnit, cu, wip, err } = this.props;
    const playableItem                = playerHelper.playableItem(cu, null, null);
  }

  // Helper function to get the frist prop in hightlights obj and apply htmlFunc on it.
  snippetFromHighlight = (highlight, props, htmlFunc) => {
    const prop = props.find(p => highlight && p in highlight && Array.isArray(highlight[p]) && highlight[p].length);
    // eslint-disable-next-line react/no-danger
    return !prop ? null : <span dangerouslySetInnerHTML={{ __html: htmlFunc(highlight[prop]) }} />;
  };

  click = (mdb_uid, index, type, rank, searchId) => {
    const { click } = this.props;
    click(mdb_uid, index, type, rank, searchId);
  };

  renderFiles = () => {
    const { cu, language } = this.props;
    return cu.files.filter(f => f.language === language).map(f => this.renderFileByType(f, cu.id));
  };

  renderFileByType = (file, cuId) => {
    switch (file.type) {
    case MT_VIDEO:
      return this.renderVideo(file, cuId);
    case MT_AUDIO:
      return this.renderAudio(file);
    case MT_TEXT:
      return this.renderText(file);
    }
  };

  renderVideo = (file, unitId) => {

    let src = assetUrl(`api/thumbnail/${unitId}`);
    if (!src.startsWith('http')) {
      src = `http://localhost${src}`;
    }
    src = `${imaginaryUrl('thumbnail')}?${Requests.makeParams({ url: src, width: 150 })}`;
    return (
      <Segment compact style={{ padding: 0 }} floated='left'>
        <Label attached='bottom left'>{this.mlsToStrColon(file.duration)}</Label>
        <Image src={src} />
      </Segment>
    );
  };

  mlsToStrColon(seconds) {
    const duration = moment.duration({ seconds });
    const h        = duration.hours();
    const m        = duration.minutes();
    const s        = duration.seconds();
    return h ? `${h}:${m}:${s}` : `${m}:${s}`;
  }

  renderAudio = (file) => {
    return (
      <Button floated='left'>
        <Icon name="file audio" />
        {`${this.props.t(`constants.media-types.${file.type}`)}`}
      </Button>
    );
  };

  renderText = (file) => {
    return (
      <Button floated='left'>
        <Icon name="file text" />
        {`${this.props.t(`constants.media-types.${file.type}`)}`}
      </Button>
    );
  };

  iconByContentType = (type) => {
    let icon;
    switch (type) {
    case CT_LESSON_PART:
      icon = 'lessons';
      break;
    default:
      icon = 'programs';
      break;
    }
    return <Image src={sectionLogo[icon]} />;
  };

  render() {
    const { t, location, queryResult, cu, hit, rank }                                            = this.props;
    const { search_result: { searchId } }                                                        = queryResult;
    const { _index: index, _type: type, _source: { mdb_uid: mdbUid }, highlight, _score: score } = hit;

    const name        = this.snippetFromHighlight(highlight, ['name', 'name_analyzed'], parts => parts.join(' ')) || cu.name;
    const description = this.snippetFromHighlight(highlight, ['description', 'description_analyzed'], parts => `...${parts.join('.....')}...`);
    const transcript  = this.snippetFromHighlight(highlight, ['transcript', 'transcript_analyzed'], parts => `...${parts.join('.....')}...`);
    const snippet     = (
      <div className="search__snippet">
        {
          description ?
            <div>
              <strong>{t('search.result.description')}: </strong>
              {description}
            </div> :
            null
        }
        {
          transcript ?
            <div>
              <strong>{t('search.result.transcript')}: </strong>
              {transcript}
            </div> :
            null
        }
      </div>);

    let filmDate = '';
    if (cu.film_date) {
      filmDate = t('values.date', { date: cu.film_date });
    }


    return (<div>
        <Table>
          <Table.Body>
            <Table.Row key={mdbUid} verticalAlign="top">
              <Table.Cell width={1}>
                {this.iconByContentType(cu.content_type)}
              </Table.Cell>
              <Table.Cell width={11}>
                <Link
                  className="search__link"
                  onClick={() => this.click(mdbUid, index, type, rank, searchId)}
                  to={canonicalLink(cu || { id: mdbUid, content_type: cu.content_type })}
                >
                  {name}
                </Link>

                {snippet || null}
                {!isDebMode(location) ? null :
                  <ScoreDebug name={cu.name} score={score} explanation={hit._explanation} />}
                <strong>{filmDate}</strong>

                <div>
                  {this.renderFiles()}
                </div>
              </Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table>
      </div>

    );
  };
}

const mapState = (state, ownProps) => {
  return {
    filters: filterSelectors.getFilters(state.filters, 'search'),
    areSourcesLoaded: sourcesSelectors.areSourcesLoaded(state.sources),
    getSourcePath: sourcesSelectors.getPathByID(state.sources),
    getSourceById: sourcesSelectors.getSourceById(state.sources),
    getTagById: tagsSelectors.getTagById(state.tags),
    wip: selectors.getWip(state.mdb),
    err: selectors.getErrors(state.mdb),
  };
};

const mapDispatch = dispatch => bindActionCreators({
  fetchUnit: actions.fetchUnit,
}, dispatch);

export default connect(mapState, mapDispatch)(translate()(SearchResultCU));

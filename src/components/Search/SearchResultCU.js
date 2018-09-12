import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';
import { Segment, Icon, Button,  Image,  } from 'semantic-ui-react';
import { bindActionCreators } from 'redux';
import moment from 'moment';
import uniq from 'lodash/uniq';

import playerHelper from '../../helpers/player';
import { canonicalLink } from '../../helpers/links';
import { isDebMode } from '../../helpers/url';
import { actions, selectors } from '../../redux/modules/mdb';
import { selectors as filterSelectors } from '../../redux/modules/filters';
import { selectors as sourcesSelectors } from '../../redux/modules/sources';
import { selectors as tagsSelectors } from '../../redux/modules/tags';
import * as shapes from '../shapes';
import { sectionLogo } from '../../helpers/images';
import Link from '../Language/MultiLanguageLink';
import ScoreDebug from './ScoreDebug';
import { MT_TEXT, MT_AUDIO, MT_VIDEO, MT_IMAGE, CT_LESSON_PART, } from '../../helpers/consts';

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

  click = (mdb_uid, index, resultType, rank, searchId) => {
    const { click } = this.props;
    click(mdb_uid, index, resultType, rank, searchId);
  };

  renderFiles = () => {
    const { cu, language } = this.props;
    return uniq(cu.files, f => f.type)
      .filter(f => f.language === language)
      .map(f => this.renderFileByType(f, cu.id));
  };

  renderFileByType = (file) => {
    let fileType;
    switch (file.type) {
    case MT_VIDEO:
      fileType = 'video';
      break;
    case MT_AUDIO:
      fileType = 'audio';
      break;
    case MT_TEXT:
      fileType = 'text';
      break;
    }

    return (<Button floated='left' size="mini" key={file.id}>
      <Icon name={'file ' + fileType} />
      {`${this.props.t(`constants.media-types.${file.type}`)}`}
    </Button>);
  };

  renderFiles = (cu = {}) => {
    const { files = [] } = cu;
    const pathname       = canonicalLink(cu);
    const types          = [
      {
        type: MT_VIDEO,
        icon: 'video',
        title: this.props.t('constants.media-types.video'),
        to: { search: 'mediaType=video' }
      },
      {
        type: MT_AUDIO,
        icon: 'audio',
        title: this.props.t('constants.media-types.audio'),
        to: { search: 'mediaType=audio' }
      },
      { type: MT_TEXT, icon: 'text', title: 'tr', to: { state: { active: 'transcription' } } },
      { type: MT_IMAGE, icon: 'image', title: 'scetches', to: { state: { active: 'transcription' } } },
    ];

    return types
      .filter(x => files.some(f => f.type === x.type))
      .map(x => this.renderFile(x, pathname));
  };

  renderFile = (data, pathname) => {
    const to = { pathname, ...data.to };
    console.log('SearchResultIntent.renderFile', to);

    return (
      <Link to={to} key={data.type}>
        <Button floated='left'>
          <Icon name={'file ' + data.icon} /> {data.title}
        </Button>
      </Link>
    );
  };

  mlsToStrColon(seconds) {
    const duration = moment.duration({ seconds });
    const h        = duration.hours();
    const m        = duration.minutes();
    const s        = duration.seconds();
    return h ? `${h}:${m}:${s}` : `${m}:${s}`;
  }

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
    const { t, location, queryResult, cu, hit, rank } = this.props;
    const { search_result: { searchId } }             = queryResult;
    const {
            _index: index,
            _type: type,
            _source:
              {
                mdb_uid: mdbUid,
                result_type: resultType
              },
            highlight,
            _score: score
          }                                           = hit;

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

    return (
      <Segment key={mdbUid} className="bgHoverGrey">
        <Link
          className="search__link"
          onClick={() => this.click(mdbUid, index, resultType, rank, searchId)}
          to={canonicalLink(cu || { id: mdbUid, content_type: cu.content_type })}
        >
          {name}

          {snippet || null}
          {!isDebMode(location) ? null :
            <ScoreDebug name={cu.name} score={score} explanation={hit._explanation} />}
          <div>
            {this.iconByContentType(cu.content_type)}
            <strong>{filmDate}</strong>
          </div>
          <div>
            {this.renderFiles()}
          </div>
        </Link>
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
    getSourcePath: sourcesSelectors.getPathByID(state.sources),
    getSourceById: sourcesSelectors.getSourceById(state.sources),
    getTagById: tagsSelectors.getTagById(state.tags),
    wip: wip === {},
    err,
  };
};

const mapDispatch = dispatch => bindActionCreators({
  fetchUnit: actions.fetchUnit,
}, dispatch);

export default connect(mapState, mapDispatch)(translate()(SearchResultCU));

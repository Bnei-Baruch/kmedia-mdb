import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { Button, Container, Icon, Image, Label } from 'semantic-ui-react';

import {
  CT_ARTICLE,
  CT_ARTICLES,
  CT_BLOG_POST,
  CT_CHILDREN_LESSON,
  CT_CHILDREN_LESSONS,
  CT_CLIP,
  CT_CLIPS,
  CT_CONGRESS,
  CT_DAILY_LESSON,
  CT_EVENT_PART,
  CT_FRIENDS_GATHERING,
  CT_FRIENDS_GATHERINGS,
  CT_FULL_LESSON,
  CT_HOLIDAY,
  CT_LECTURE_SERIES,
  CT_LELO_MIKUD,
  CT_LESSON_PART,
  CT_LESSONS_SERIES,
  CT_MEAL,
  CT_MEALS,
  CT_PICNIC,
  CT_SPECIAL_LESSON,
  CT_TRAINING,
  CT_UNITY_DAY,
  CT_VIDEO_PROGRAM,
  CT_VIDEO_PROGRAM_CHAPTER,
  CT_VIRTUAL_LESSON,
  CT_VIRTUAL_LESSONS,
  CT_WOMEN_LESSON,
  CT_WOMEN_LESSONS,
  MT_AUDIO,
  MT_IMAGE,
  MT_TEXT,
  MT_VIDEO,
  SEARCH_INTENT_INDEX_SOURCE,
  SEARCH_INTENT_INDEX_TOPIC
} from '../../helpers/consts';
import { sectionLogo } from '../../helpers/images';
import { canonicalLink } from '../../helpers/links';
import { isDebMode } from '../../helpers/url';
import * as shapes from '../shapes';
import Link from '../Language/MultiLanguageLink';
import ScoreDebug from './ScoreDebug';
import { formatDuration } from '../../helpers/utils';

const PATH_SEPARATOR = ' > ';

class SearchResultBase extends Component {
  static propTypes = {
    queryResult: PropTypes.shape({
      intents: PropTypes.arrayOf(PropTypes.shape({
        language: PropTypes.string,
        type: PropTypes.string,
        value: PropTypes.shape({}),
      })),
      search_result: PropTypes.shape({})
    }),
    t: PropTypes.func.isRequired,
    filters: PropTypes.arrayOf(PropTypes.shape({
      name: PropTypes.string,
      values: PropTypes.arrayOf(PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.arrayOf(PropTypes.string)
      ]))
    })).isRequired,
    location: shapes.HistoryLocation.isRequired,
    click: PropTypes.func.isRequired,
    getTagById: PropTypes.func.isRequired,
    getSourceById: PropTypes.func.isRequired,
    hit: PropTypes.shape({}).isRequired,
    rank: PropTypes.number,
  };

  static defaultProps = {
    queryResult: null,
    rank: 0,
  };

  static mlsToStrColon(seconds) {
    const duration = moment.duration({ seconds });
    const h        = duration.hours();
    let m          = duration.minutes();
    let s          = duration.seconds();
    m              = m > 9 ? m : `0${m}`;
    s              = s > 9 ? s : `0${s}`;
    return h ? `${h}:${m}:${s}` : `${m}:${s}`;
  }

  logClick = (mdbUid, index, type, rank, searchId) => {
    const { click, location } = this.props;
    const deb                 = isDebMode(location);
    click(mdbUid, index, type, rank, searchId, deb);
  };

  renderFiles = (cu, mdbUid, index, resultType, rank, searchId) => {
    const { t }           = this.props;
    const { files = [] }  = cu;
    const pathname        = canonicalLink(cu);
    const contentLanguage = this.getMediaLanguage(this.props.filters);
    const types           = [
      {
        type: MT_VIDEO,
        icon: 'video play',
        title: t('constants.media-types.video'),
        to: { search: 'mediaType=video' }
      },
      {
        type: MT_AUDIO,
        icon: 'volume up',
        title: t('constants.media-types.audio'),
        to: { search: 'mediaType=audio' }
      },
      {
        type: MT_TEXT,
        icon: 'file text',
        title: t('materials.transcription.header'),
        to: { state: { active: 'transcription' } }
      },
      {
        type: MT_IMAGE,
        icon: 'images outline',
        title: t('materials.sketches.header'),
        to: { state: { active: 'sketches' } }
      },
    ];

    return types
      .filter(x => files.some(f => f.type === x.type))
      .map(x => this.renderFile(x, pathname, contentLanguage, mdbUid, index, resultType, rank, searchId));
  };

  renderFile = (data, pathname, contentLanguage, mdbUid, index, resultType, rank, searchId) => {
    const to = { pathname, ...data.to };
    return (
      <Link
        key={data.type}
        onClick={() => this.logClick(mdbUid, index, resultType, rank, searchId)}
        contentLanguage={contentLanguage}
        to={to}
      >

        <Button basic floated="left" size="mini" className="link_to_file">
          <Icon name={data.icon} />
          {' '}
          {data.title}
        </Button>
      </Link>
    );
  };

  iconByContentType = (type, withTitle) => {
    let icon;

    switch (type) {
    case CT_LESSON_PART:
    case CT_FULL_LESSON:
    case CT_VIRTUAL_LESSON:
    case CT_WOMEN_LESSON:
    case CT_CHILDREN_LESSON:
    case CT_LELO_MIKUD:
    case CT_DAILY_LESSON:
    case CT_SPECIAL_LESSON:
    case CT_LECTURE_SERIES:
    case CT_CHILDREN_LESSONS:
    case CT_WOMEN_LESSONS:
    case CT_VIRTUAL_LESSONS:
    case CT_LESSONS_SERIES:
      icon = 'lessons';
      break;
    case CT_FRIENDS_GATHERING:
    case CT_MEAL:
    case CT_EVENT_PART:
    case CT_TRAINING:
    case CT_UNITY_DAY:
    case CT_FRIENDS_GATHERINGS:
    case CT_CONGRESS:
    case CT_MEALS:
    case CT_HOLIDAY:
    case CT_PICNIC:
      icon = 'events';
      break;
    case CT_ARTICLE:
    case CT_ARTICLES:
    case CT_BLOG_POST:
      icon = 'publications';
      break;
    case CT_VIDEO_PROGRAM_CHAPTER:
    case CT_CLIP:
    case CT_VIDEO_PROGRAM:
    case CT_CLIPS:
      icon = 'programs';
      break;
    case 'sources':
      icon = 'sources';
      break;
    default:
      return null;
    }

    if (!withTitle) {
      return <Image src={sectionLogo[icon]} size="mini" verticalAlign="middle" />;
    }

    return (
      <span>
        <Image src={sectionLogo[icon]} size="mini" verticalAlign="middle" />
        &nbsp;
        <span>{this.props.t(`constants.content-types.${type}`)}</span>
      </span>
    );
  };

  titleFromHighlight = (highlight = {}, defVal) => {
    let prop = ['title', 'title_language'].find(p => highlight && p in highlight && Array.isArray(highlight[p]) && highlight[p].length);
    prop     = highlight[prop] ? highlight[prop].join(PATH_SEPARATOR) : defVal;

    if (!prop) {
      return null;
    }
    const titleArr = prop.split(PATH_SEPARATOR);
    let title      = `${titleArr.splice(-1)}`;
    if (titleArr.length > 0) {
      title += ` / ${titleArr.join(PATH_SEPARATOR)}`;
    }
    return <span dangerouslySetInnerHTML={{ __html: title }} />;
  };

  // Helper function to get the frist prop in hightlights obj and apply htmlFunc on it.
  snippetFromHighlight = (highlight = {}, props = ['content', 'content_language']) => {
    const prop = props.find(p => highlight && p in highlight && Array.isArray(highlight[p]) && highlight[p].length);

    if (!prop) {
      return null;
    }
    const __html = `...${highlight[prop].join('.....')}...`;
    return <span dangerouslySetInnerHTML={{ __html }} />;
  };

  getFilterById = (index) => {
    const { getTagById, getSourceById } = this.props;
    switch (index) {
    case SEARCH_INTENT_INDEX_TOPIC:
      return getTagById;
    case SEARCH_INTENT_INDEX_SOURCE:
      return getSourceById;
    default:
      console.log('Using default filter:', index);
      return x => x;
    }
  };

  getMediaLanguage = (filters) => {
    if (!filters) {
      return null;
    }
    let mediaLanguage;
    const filteredLanguages = filters.find(f => f.name === 'language-filter');
    if (filteredLanguages && filteredLanguages.values.length > 0) {
      mediaLanguage = filteredLanguages.values[0];
    }
    return mediaLanguage;
  };

  renderDebug = (name) => {
    const { location, hit }                            = this.props;
    const { _explanation: explanation, _score: score } = hit;

    if (!isDebMode(location)) {
      return null;
    }

    return (
      <Container>
        <ScoreDebug name={name} score={score} explanation={explanation} />
      </Container>
    );
  };

  fileDuration = (files) => {
    const fileWithDuration = files ? files.find(f => f.type === 'video' || f.type === 'audio') : null;
    return (
      fileWithDuration
        ? <Label as="span" size="small">{formatDuration(fileWithDuration.duration)}</Label>
        : null
    );
  };

  render() {
    return null;
  }
}

export default SearchResultBase;

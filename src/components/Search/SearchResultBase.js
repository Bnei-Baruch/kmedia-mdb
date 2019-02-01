import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { Button, Image, Icon, Container } from 'semantic-ui-react';

import {
  SEARCH_INTENT_INDEX_TOPIC,
  SEARCH_INTENT_INDEX_SOURCE,
  MT_TEXT,
  MT_AUDIO,
  MT_VIDEO,
  MT_IMAGE,
  CT_LESSON_PART,
  CT_CLIP,
  CT_WOMEN_LESSON,
  CT_CHILDREN_LESSON,
  CT_LELO_MIKUD,
  CT_FRIENDS_GATHERING,
  CT_MEAL,
  CT_EVENT_PART,
  CT_TRAINING,
  CT_ARTICLE,
  CT_VIDEO_PROGRAM_CHAPTER,
  CT_FULL_LESSON,
  CT_VIRTUAL_LESSON,

  CT_DAILY_LESSON,
  CT_SPECIAL_LESSON,
  CT_FRIENDS_GATHERINGS,
  CT_VIDEO_PROGRAM,
  CT_LECTURE_SERIES,
  CT_CHILDREN_LESSONS,
  CT_WOMEN_LESSONS,
  CT_VIRTUAL_LESSONS,
  CT_MEALS,
  CT_CONGRESS,
  CT_HOLIDAY,
  CT_PICNIC,
  CT_UNITY_DAY,
  CT_CLIPS,
  CT_ARTICLES,
  CT_LESSONS_SERIES,
  CT_BLOG_POST
} from '../../helpers/consts';
import { sectionLogo } from '../../helpers/images';
import { canonicalLink } from '../../helpers/links';
import { isDebMode } from '../../helpers/url';
import * as shapes from '../shapes';
import Link from '../Language/MultiLanguageLink';
import ScoreDebug from './ScoreDebug';

const PATH_SEPARATOR = ' > ';

class SearchResultBase extends Component {
  static propTypes = {
    queryResult: PropTypes.object,
    language: PropTypes.string.isRequired,
    t: PropTypes.func.isRequired,
    filters: PropTypes.array.isRequired,
    location: shapes.HistoryLocation.isRequired,
    click: PropTypes.func.isRequired,
    hit: PropTypes.object,
    rank: PropTypes.number
  };

  static defaultProps = {
    queryResult: null,
  };

  click = (mdb_uid, index, type, rank, searchId) => {
    const { click, location } = this.props;
    const deb = isDebMode(location);
    click(mdb_uid, index, type, rank, searchId, deb);
  };

  mlsToStrColon(seconds) {
    const duration = moment.duration({ seconds });
    const h        = duration.hours();
    let m          = duration.minutes();
    let s          = duration.seconds();
    m              = m > 9 ? m : `0${m}`;
    s              = s > 9 ? s : `0${s}`;
    return h ? `${h}:${m}:${s}` : `${m}:${s}`;
  }

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
      <Link key={data.type}
            onClick={() => this.click(mdbUid, index, resultType, rank, searchId)}
            contentLanguage={contentLanguage}
            to={to}>

        <Button basic floated="left" size="mini" className="link_to_file">
          <Icon name={data.icon} /> {data.title}
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
        <Image src={sectionLogo[icon]} size="mini" verticalAlign="middle" />&nbsp;
        <span>{this.props.t(`constants.content-types.${type}`)}</span>
      </span>
    );
  };

  titleFromHighlight = (highlight, defVal) => {
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
    // eslint-disable-next-line react/no-danger
    return <span dangerouslySetInnerHTML={{ __html: title }} />;
  };

  // Helper function to get the frist prop in hightlights obj and apply htmlFunc on it.
  snippetFromHighlight = (highlight, props = ['content', 'content_language']) => {
    const prop = props.find(p => highlight && p in highlight && Array.isArray(highlight[p]) && highlight[p].length);

    if (!prop) {
      return null;
    }
    const __html = `...${highlight[prop].join('.....')}...`;
    // eslint-disable-next-line react/no-danger
    return <span dangerouslySetInnerHTML={{ __html }} />;
  };

  getFilterById = index => {
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

    if (!isDebMode(location) || !explanation) {
      return null;
    }

    return (
      <Container>
        <ScoreDebug name={name} score={score} explanation={explanation} />
      </Container>
    );
  };

  render() {
    return null;
  }
}

export default SearchResultBase;

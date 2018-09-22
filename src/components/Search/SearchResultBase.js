import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';
import moment from 'moment';
import { Button, Image, Icon } from 'semantic-ui-react';

import { sectionLogo } from '../../helpers/images';
import { canonicalLink } from '../../helpers/links';
import * as shapes from '../shapes';
import Link from '../Language/MultiLanguageLink';
import {
  SEARCH_INTENT_INDEX_TOPIC,
  SEARCH_INTENT_INDEX_SOURCE,
  MT_TEXT,
  MT_AUDIO,
  MT_VIDEO,
  MT_IMAGE,
  CT_LESSON_PART
} from '../../helpers/consts';

const PATH_SEPARATOR = ' > ';

class SearchResultBase extends Component {
  static propTypes = {
    results: PropTypes.object,
    areSourcesLoaded: PropTypes.bool.isRequired,
    queryResult: PropTypes.object,
    language: PropTypes.string.isRequired,
    wip: shapes.WIP,
    err: shapes.Error,
    t: PropTypes.func.isRequired,
    filters: PropTypes.array.isRequired,
    location: shapes.HistoryLocation.isRequired,
    click: PropTypes.func.isRequired,
  };

  static defaultProps = {
    queryResult: null,
    wip: false,
    err: null,
    intents: [],
  };

  click = (mdb_uid, index, type, rank, searchId) => {
    const { click } = this.props;
    click(mdb_uid, index, type, rank, searchId);
  };

  mlsToStrColon(seconds) {
    const duration = moment.duration({ seconds });
    const h        = duration.hours();
    const m        = duration.minutes();
    const s        = duration.seconds();
    return h ? `${h}:${m}:${s}` : `${m}:${s}`;
  }

  renderFiles = (cu) => {
    const { t }          = this.props;
    const { files = [] } = cu;
    const pathname       = canonicalLink(cu);
    const types          = [
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
      .map(x => this.renderFile(x, pathname));
  };

  renderFile = (data, pathname) => {
    const to = { pathname, ...data.to };

    return (
      <Link to={to} key={data.type}>
        <Button floated='left' size="mini" className="linkToFile" basic color='blue'>
          <Icon name={data.icon} /> {data.title}
        </Button>
      </Link>
    );
  };

  iconByContentType = (type, withTitle) => {
    let icon;
    switch (type) {
    case CT_LESSON_PART:
      icon = 'lessons';
      break;
    default:
      icon = 'programs';
      break;
    }

    if (!withTitle) {
      return <Image size="mini" floated="left" src={sectionLogo[icon]} />;
    }

    return (<span>
      <Image size="mini" floated="left" src={sectionLogo[icon]} />&nbsp;
      <span>{this.props.t(`filters.sections-filter.${icon}`)}</span>
    </span>);
  };

  titleFromHighlight = (highlight, defVal) => {
    let prop = ['title', 'title_language'].find(p => highlight && p in highlight && Array.isArray(highlight[p]) && highlight[p].length);
    prop     = highlight[prop] ? highlight[prop].join(PATH_SEPARATOR) : defVal;

    if (!prop) {
      return null;
    }
    const titleArr = prop.split(PATH_SEPARATOR);
    const title    = `${titleArr.splice(-1)} / ${titleArr.join(PATH_SEPARATOR)}`;
    // eslint-disable-next-line react/no-danger
    return <span dangerouslySetInnerHTML={{ __html: title }} />;
  };

  // Helper function to get the frist prop in hightlights obj and apply htmlFunc on it.
  snippetFromHighlight = (highlight, props, htmlFunc) => {
    const prop   = ['content', 'content_language'].find(p => highlight && p in highlight && Array.isArray(highlight[p]) && highlight[p].length);
    const __html = `...${highlight[prop].join('.....')}...`;
    // eslint-disable-next-line react/no-danger
    return !prop ? null : <span dangerouslySetInnerHTML={{ __html }} />;
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

  render() {
    return null;
  }
}

export default translate()(SearchResultBase);

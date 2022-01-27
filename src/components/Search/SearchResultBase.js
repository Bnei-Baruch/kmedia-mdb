import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Container, Icon, Image, Label } from 'semantic-ui-react';
import { formatDuration, physicalFile } from '../../helpers/utils';

import {
  CT_KITEI_MAKOR,
  MT_AUDIO,
  MT_IMAGE,
  MT_TEXT,
  MT_VIDEO,
  SEARCH_INTENT_INDEX_SOURCE,
  SEARCH_INTENT_INDEX_TOPIC,
  CT_LIKUTIM,
  iconByContentTypeMap,
} from '../../helpers/consts';
import { SectionLogo } from '../../helpers/images';
import { canonicalLink } from '../../helpers/links';
import { isDebMode, stringify } from '../../helpers/url';
import * as shapes from '../shapes';
import Link from '../Language/MultiLanguageLink';
import ScoreDebug from './ScoreDebug';

const PATH_SEPARATOR = ' > ';

const MIN_NECESSARY_WORDS_FOR_SEARCH = 4;

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
    contentLanguage: PropTypes.string.isRequired,
    searchLanguage: PropTypes.string,
    chronicles: PropTypes.shape(),
  };

  static defaultProps = {
    queryResult: null,
    rank: 0,
  };

  static mlsToStrColon(seconds) {
    const duration = new Date(seconds * 1000); // ms
    const h        = duration.getUTCHours();
    let m          = duration.getUTCMinutes();
    let s          = duration.getUTCSeconds();
    m              = m > 9 ? m : `0${m}`;
    s              = s > 9 ? s : `0${s}`;
    return h ? `${h}:${m}:${s}` : `${m}:${s}`;
  }

  // Extract from derived units all kitei makor text and audio files.
  static getKiteiMakor = (units, contentLanguage) => Object.values(units || {})
    .filter(unit => [CT_KITEI_MAKOR, CT_LIKUTIM].includes(unit.content_type))
    .filter(unit => unit.files)
    .map(unit => unit.files.filter(file => file.language === contentLanguage && ((unit.content_type === CT_KITEI_MAKOR && file.type === MT_AUDIO) || (unit.content_type === CT_LIKUTIM && file.type === MT_TEXT))))
    .reduce((acc, files) => {
      files.forEach(file => acc.push(file));
      return acc;
    }, []);

  logClick = (mdbUid, index, type, rank, searchId) => {
    const { click, location, chronicles } = this.props;
    const deb                             = isDebMode(location);
    chronicles.searchSelected({ mdbUid, index, type, rank, searchId, deb });
    click(mdbUid, index, type, rank, searchId, deb);
  };

  // Renders both direct and direct content unit files.
  renderFiles = (cu, mdbUid, index, resultType, rank, searchId) => {
    const { t, filters, contentLanguage } = this.props;
    const { files = [] }                  = cu;
    const pathname                        = canonicalLink(cu);
    const mediaContentLanguage            = this.getMediaLanguage(filters) || contentLanguage;
    const fileTypes                       = [
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

    const kiteiMakorFiles = SearchResultBase.getKiteiMakor(cu.derived_units, mediaContentLanguage);

    return fileTypes
      .filter(x => files.some(f => f.type === x.type))
      .map(x => this.renderFile(x, pathname, contentLanguage, mdbUid, index, resultType, rank, searchId))
      .concat(kiteiMakorFiles.map(f => this.renderKiteiMakor(f, mdbUid, index, resultType, rank, searchId)));
  };

  renderKiteiMakor = (file, mdbUid, index, resultType, rank, searchId) => {
    const { t } = this.props;
    const url   = physicalFile(file);
    const icon  = file.type === MT_TEXT ? 'file text' : 'volume up';
    return (
      <Button
        key={`${file.type}-${mdbUid}`}
        as="a"
        href={url}
        target="_blank"
        onClick={() => this.logClick(mdbUid, index, resultType, rank, searchId)}
        basic
        floated="left" size="mini" className="link_to_file">
        <Icon name={icon} />
        {' '}
        {t('constants.content-types.KITEI_MAKOR')}
      </Button>
    );
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

  iconByContentType = (type, t, noLink) => {
    const icon    = iconByContentTypeMap.get(type) || null;
    const content = <span>
      <Image size="mini" verticalAlign="middle">
        <SectionLogo name={icon} width='25' height='25' />
      </Image>
      &nbsp;
      <span>{t(`constants.content-types.${type}`)}</span>
    </span>;

    if (noLink)
      return content;

    const { canonicalLinkParams, logLinkParams, canonicalLinkSearch: { language } } = this.buildLinkParams();

    return (
      <Link
        className="margin-right-4"
        onClick={() => this.logClick(...logLinkParams)}
        to={{
          pathname: canonicalLink(...canonicalLinkParams),
          search: stringify({ language })
        }}
      >
        {content}
      </Link>
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

  clearStringForLink = str => str.replace(/(\r?\n|\r){1,}/g, ' ').replace(/<.+?>/gi, '');

  highlightWrapToLink = (__html, index, pathname, search, logLinkParams) => {
    const searchArr = this.clearStringForLink(__html).split(' ');

    search.srchstart    = searchArr.slice(0, MIN_NECESSARY_WORDS_FOR_SEARCH).join(' ');
    search.srchend      = searchArr.slice(-1 * MIN_NECESSARY_WORDS_FOR_SEARCH).join(' ');
    search.highlightAll = true;

    return (<Link
      key={`highlightLink_${index}`}
      onClick={() => this.logClick(...logLinkParams)}
      className={'hover-under-line'}
      to={{ pathname, search: stringify(search) }}>
      <span dangerouslySetInnerHTML={{ __html: `...${__html}...` }} />
    </Link>);
  };

  snippetFromHighlightWithLink = (highlight = {}, props = ['content', 'content_language']) => {
    const prop = props.find(p => highlight && p in highlight && Array.isArray(highlight[p]) && highlight[p].length);

    if (!prop) {
      return null;
    }

    const { canonicalLinkParams, logLinkParams, canonicalLinkSearch: search } = this.buildLinkParams();
    const baseLink                                                            = canonicalLink(...canonicalLinkParams);

    const __html = highlight[prop].map((h, i) => this.highlightWrapToLink(h, i, baseLink, search, logLinkParams));
    return <span>{__html}</span>;
  };

  buildLinkParams = () => {
    const { queryResult: { search_result: { searchId } }, hit, rank, filters }      = this.props;
    const { _index: index, _source: { mdb_uid: mdbUid, result_type: resultType }, } = hit;

    return {
      canonicalLinkParams: [{ id: mdbUid, content_type: 'POST' }, this.getMediaLanguage(filters)],
      canonicalLinkSearch: {},
      logLinkParams: [mdbUid, index, resultType, rank, searchId]
    };
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

  getMediaLanguage = filters => {
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

  renderDebug = name => {
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

  fileDuration = files => {
    const fileWithDuration = files ? files.find(f => f.type === 'video' || f.type === 'audio') : null;
    if (!fileWithDuration) {
      return null;
    }

    return (
      <Label as="span" size="small">{formatDuration(fileWithDuration.duration)}</Label>
    );
  };

  render() {
    return null;
  }
}

export default SearchResultBase;

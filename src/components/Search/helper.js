import React from 'react';

import { iconByContentTypeMap, SEARCH_INTENT_INDEX_SOURCE, } from '../../helpers/consts';
import { SectionLogo } from '../../helpers/images';
import { canonicalLink } from '../../helpers/links';
import { isDebMode, stringify } from '../../helpers/url';
import Link from '../Language/MultiLanguageLink';

const PATH_SEPARATOR = ' > ';

const MIN_NECESSARY_WORDS_FOR_SEARCH = 4;

export const mlsToStrColon = seconds => {
  const duration = new Date(seconds * 1000); // ms
  const h        = duration.getUTCHours();
  let m          = duration.getUTCMinutes();
  let s          = duration.getUTCSeconds();
  m              = m > 9 ? m : `0${m}`;
  s              = s > 9 ? s : `0${s}`;
  return h ? `${h}:${m}:${s}` : `${m}:${s}`;
};

export const logClick = (mdbUid, index, type, rank, searchId) => {
  const { click, location, chronicles } = this.props;
  const deb                             = isDebMode(location);
  chronicles.searchSelected({ mdbUid, index, type, rank, searchId, deb });
  click(mdbUid, index, type, rank, searchId, deb);
};

export const getMediaLanguage = filters => {
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

export const iconByContentType = (type, t) => {
  const icon = iconByContentTypeMap.get(type) || null;
  return (
    <div className="search_result_icon">
      <SectionLogo name={icon} width="75" height="75" />
      <span>{t(`constants.content-types.${type}`)}</span>
    </div>
  );
};

export const titleFromHighlight = (highlight = {}, defVal) => {
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
export const snippetFromHighlight = (highlight = {}, props = ['content', 'content_language']) => {
  const prop = props.find(p => highlight && p in highlight && Array.isArray(highlight[p]) && highlight[p].length);

  if (!prop) {
    return null;
  }

  const __html = `...${highlight[prop].join('.....')}...`;
  return <span dangerouslySetInnerHTML={{ __html }} />;
};

export const clearStringForLink = str => str.replace(/(\r?\n|\r){1,}/g, ' ').replace(/<.+?>/gi, '');

export const highlightWrapToLink = (__html, index, pathname, search, logLinkParams) => {
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

export const snippetFromHighlightWithLink = (highlight = {}, props = ['content', 'content_language']) => {
  const prop = props.find(p => highlight && p in highlight && Array.isArray(highlight[p]) && highlight[p].length);

  if (!prop) {
    return null;
  }

  const { canonicalLinkParams, logLinkParams, canonicalLinkSearch: search } = this.buildLinkParams();
  const baseLink                                                            = canonicalLink(...canonicalLinkParams);

  const __html = highlight[prop].map((h, i) => this.highlightWrapToLink(h, i, baseLink, search, logLinkParams));
  return <span>{__html}</span>;
};

export const parentTypeByIndex = index => (index === SEARCH_INTENT_INDEX_SOURCE) ? 'source' : 'tag';


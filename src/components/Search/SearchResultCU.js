import React from 'react';
import {Container, Header, Segment} from 'semantic-ui-react';

import {canonicalLink, insertScrollToSearchParam} from '../../helpers/links';
import * as renderUnitHelper from '../../helpers/renderUnitHelper';
import Link from '../Language/MultiLanguageLink';
import SearchResultBase from './SearchResultBase';
import * as shapes from '../shapes';

class SearchResultCU extends SearchResultBase {
  static propTypes = {
    cu: shapes.ContentUnit,
  };

  highlightWrapToLink = (__html, pathname, activeTab) => {
    let param = __html.replace(/<.+?>/gi, '');
    return (<Link
      to={{
        pathname,
        state: {active: activeTab},
        search: `searchScroll=${param}`
      }}>
      <span dangerouslySetInnerHTML={{__html: `...${__html}...`}}/>
    </Link>);
  };

  snippetFromHighlightWithLink = (highlight = {}, props, activeTab) => {
    const prop = props.find(p => highlight && p in highlight && Array.isArray(highlight[p]) && highlight[p].length);

    if (!prop) {
      return null;
    }

    const {cu, filters} = this.props;
    const baseLink = canonicalLink(cu, this.getMediaLanguage(filters));

    const __html = highlight[prop].map(h => this.highlightWrapToLink(h, baseLink, activeTab));
    return <span>{__html}</span>;
  };

  renderSnippet = (highlight) => {
    const content = this.snippetFromHighlightWithLink(highlight, ['content', 'content_language'], 'transcription');
    const description = this.snippetFromHighlight(highlight, ['description', 'description_language']);

    return (
      <div className="search__snippet">
        {
          description
            ? (
              <div>
                <strong>
                  {this.props.t('search.result.description')}
                  :
                  {' '}
                </strong>
                {description}
              </div>
            )
            : null
        }
        {
          content
            ? (
              <div>
                <strong>
                  {this.props.t('search.result.transcript')}
                  :
                  {' '}
                </strong>
                {content}
              </div>
            )
            : null
        }
      </div>
    );
  };

  render() {
    const {t, queryResult, cu, hit, rank, filters} = this.props;

    const {search_result: {searchId}} = queryResult;

    const
      {
        _index: index,
        _source: {
          mdb_uid: mdbUid,
          result_type: resultType
        },
        highlight,
      } = hit;

    const filmDate = renderUnitHelper.getFilmDate(cu, t);

    return (
      <Segment className="bg_hover_grey search__block">
        <Header as="h3">
          <Link
            className="search__link content"
            onClick={() => this.logClick(mdbUid, index, resultType, rank, searchId)}
            to={canonicalLink(cu || {id: mdbUid, content_type: cu.content_type}, this.getMediaLanguage(filters))}
          >
            {this.titleFromHighlight(highlight, cu.name)}
          </Link>
          {this.fileDuration(cu.files)}
        </Header>

        <Container>
          {this.iconByContentType(cu.content_type, true, t)}
          {' '}
          |
          <strong>{filmDate}</strong>
          <div className="clear"/>
        </Container>

        <Container className="content">{this.renderSnippet(highlight)}</Container>

        <Container>
          {this.renderFiles(cu, mdbUid, index, resultType, rank, searchId)}
          <div className="clear"/>
        </Container>

        {this.renderDebug(cu.name)}
      </Segment>
    );
  }
}

export default SearchResultCU;

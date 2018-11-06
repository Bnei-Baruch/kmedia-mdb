import React from 'react';
import { connect } from 'react-redux';
import { Table, Button } from 'semantic-ui-react';

import { canonicalLink } from '../../helpers/links';
import { isDebMode } from '../../helpers/url';
import { assetUrl } from '../../helpers/Api';
import * as shapes from '../shapes';
import Link from '../Language/MultiLanguageLink';
import ScoreDebug from './ScoreDebug';
import FallbackImage from '../shared/FallbackImage';
import SearchResultBase from './SearchResultBase';

class SearchResultCollection extends SearchResultBase {

  static propTypes = {
    ...SearchResultBase.props,
    c: shapes.Collection,
  };

  renderCU = (cu) => {
    return (
      <Link to={canonicalLink(cu, this.getMediaLanguage(this.props.filters))} key={cu.id}>
        <Button size="tiny" basic className="linkToCU">{cu.name}</Button>
      </Link>
    );
  };

  render() {
    const { t, location, c, hit, rank, queryResult, filters }                                    = this.props;
    const { _index: index, _type: type, _source: { mdb_uid: mdbUid }, highlight, _score: score } = hit;
    const { search_result: { searchId } }                                                        = queryResult;

    return (
      <Table className="bgHoverGrey search__block">
        <Table.Body>
          <Table.Row key={mdbUid} verticalAlign="top">
            <Table.Cell collapsing singleLine width={1}>
              <FallbackImage
                src={assetUrl(`logos/collections/${c.id}.jpg`)}
                circular
                size="tiny" />
            </Table.Cell>
            <Table.Cell>
              <Link
                className="search__link"
                onClick={() => this.click(mdbUid, index, type, rank, searchId)}
                to={canonicalLink(c || { id: mdbUid, content_type: c.content_type }, this.getMediaLanguage(filters))}>
                {this.titleFromHighlight(highlight, c.name)}
              </Link>
              <div>
                <Link
                  onClick={() => this.click(mdbUid, index, type, rank, searchId)}
                  to={canonicalLink(c || { id: mdbUid, content_type: c.content_type }, this.getMediaLanguage(filters))}>
                  {this.iconByContentType(c.content_type, true)}
                </Link>
                &nbsp;|&nbsp;
                <span>{c.content_units.length} {t('pages.collection.items.programs-collection')}</span>
                <div className="clear" />
              </div>
              <div>
                {c.content_units.slice(0, 5).map(this.renderCU)}
              </div>
            </Table.Cell>
            {
              !isDebMode(location) ? null :
                <Table.Cell collapsing textAlign="right">
                  <ScoreDebug name={c.name} score={score} explanation={hit._explanation} />
                </Table.Cell>
            }
          </Table.Row>
        </Table.Body>
      </Table>
    );
  };

}

export default SearchResultCollection;

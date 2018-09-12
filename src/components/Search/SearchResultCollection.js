import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';
import { Table, Image, Label } from 'semantic-ui-react';

import { canonicalLink } from '../../helpers/links';
import { isDebMode } from '../../helpers/url';
import * as shapes from '../shapes';
import { sectionLogo } from '../../helpers/images';
import Link from '../Language/MultiLanguageLink';
import ScoreDebug from './ScoreDebug';
import CollectionLogo from '../shared/Logo/CollectionLogo';

import { CT_LESSON_PART } from '../../helpers/consts';

class SearchResultCollection extends Component {

  static propTypes = {
    hit: PropTypes.object,
    c: shapes.Collection,
    rank: PropTypes.number
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
    return <Image src={sectionLogo[icon]} size='tiny' verticalAlign='middle' />;
  };

  renderCU = (cu) => {
    return (
      <Link to={canonicalLink(cu)} key={cu.id}>
        <Label size="tiny">{cu.name}</Label>
      </Link>
    );
  };

  render() {
    const { t, location, c, hit, snippetFromHighlight } = this.props;

    const { _source: { mdb_uid: mdbUid }, highlight, _score: score } = hit;

    const name = snippetFromHighlight(highlight, ['name', 'name_analyzed'], parts => parts.join(' ')) || c.name;

    return (
      <Table>
        <Table.Body>
          <Table.Row key={mdbUid} verticalAlign="top">
            <Table.Cell collapsing singleLine width={1}>
              <CollectionLogo collectionId={c.id} circular />
            </Table.Cell>
            <Table.Cell>
              <Link
                className="search__link"
                to={canonicalLink(c || { id: mdbUid, content_type: c.content_type })}>
                {name}
              </Link>
              <div>
                <Link to={canonicalLink(c || { id: mdbUid, content_type: c.content_type })}>
                  {this.iconByContentType(c.content_type)}
                  <span>{t(`constants.content-types.${c.content_type}`)}</span>
                </Link>
                <span>{c.content_units.length} {t('pages.collection.items.programs-collection')}</span>
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

export default translate()(SearchResultCollection);

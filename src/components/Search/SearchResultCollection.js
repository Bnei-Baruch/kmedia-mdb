import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';
import { Segment, Icon, Button, Table, Image, Label } from 'semantic-ui-react';
import { bindActionCreators } from 'redux';
import moment from 'moment';
import uniq from 'lodash/uniq';

import playerHelper from '../../helpers/player';
import { canonicalLink } from '../../helpers/links';
import { assetUrl, imaginaryUrl, Requests } from '../../helpers/Api';
import { isDebMode } from '../../helpers/url';
import { actions, selectors } from '../../redux/modules/mdb';
import { selectors as filterSelectors } from '../../redux/modules/filters';
import { selectors as sourcesSelectors } from '../../redux/modules/sources';
import { selectors as tagsSelectors } from '../../redux/modules/tags';
import * as shapes from '../shapes';
import { sectionLogo } from '../../helpers/images';
import Link from '../Language/MultiLanguageLink';
import ScoreDebug from './ScoreDebug';
import { MT_TEXT, MT_AUDIO, MT_VIDEO, CT_LESSON_PART } from '../../helpers/consts';

class SearchResultCollection extends Component {

  static propTypes = {
    hit: PropTypes.object,
    c: shapes.Collection,
    rank: PropTypes.number
  };

  render() {
    const { t, location, queryResult, c, hit, rank } = this.props;
    const { search_result: { searchId } }            = queryResult;

    const { _index: index, _type: type, _source: { mdb_uid: mdbUid }, highlight, _score: score } = hit;

    const name        = this.snippetFromHighlight(highlight, ['name', 'name_analyzed'], parts => parts.join(' ')) || c.name;
    const description = this.snippetFromHighlight(highlight, ['description', 'description_analyzed'], parts => `...${parts.join('.....')}...`);
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
      </div>);

    let startDate = '';
    if (c.start_date) {
      startDate = t('values.date', { date: c.start_date });
    }

    return (
      <Table.Row key={mdbUid} verticalAlign="top">
        <Table.Cell collapsing singleLine width={1}>
          <strong>{startDate}</strong>
        </Table.Cell>
        <Table.Cell collapsing singleLine>
          <Label size="tiny">{t(`constants.content-types.${c.content_type}`)}</Label>
        </Table.Cell>
        <Table.Cell>
          <Link
            className="search__link"
            onClick={() => this.click(mdbUid, index, type, rank, searchId)}
            to={canonicalLink(c || { id: mdbUid, content_type: c.content_type })}
          >
            {name}
          </Link>
          &nbsp;&nbsp;
          {snippet || null}
        </Table.Cell>
        {
          !isDebMode(location) ? null :
            <Table.Cell collapsing textAlign="right">
              <ScoreDebug name={c.name} score={score} explanation={hit._explanation} />
            </Table.Cell>
        }
      </Table.Row>
    );
  };

}

const mapState = (state, ownProps) => {
  const { units: wip } = selectors.getWip(state.mdb);
  const { units: err } = selectors.getErrors(state.mdb);

  return {
    wip,
    err,
  };
};

const mapDispatch = dispatch => bindActionCreators({}, dispatch);

export default connect(mapState, mapDispatch)(translate()(SearchResultCollection));

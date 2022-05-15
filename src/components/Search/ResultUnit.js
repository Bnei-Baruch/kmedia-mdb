import React from 'react';
import { withNamespaces } from 'react-i18next';
import { Container, Header, Segment } from 'semantic-ui-react';
import Link from '../Language/MultiLanguageLink';
import { canonicalLink } from '../../helpers/links';
import ScoreDebug from './ScoreDebug';
import { isDebMode } from '../../helpers/url';
import { getMediaLanguage, iconByContentType, logClick, snippetFromHighlight, titleFromHighlight } from './helper';
import { useSelector } from 'react-redux';
import { selectors as filterSelectors } from '../../redux/modules/filters';
import { useLocation } from 'react-router-dom';
import { selectors } from '../../redux/modules/search';
import { selectors as mdb } from '../../redux/modules/mdb';
import * as renderUnitHelper from '../../helpers/renderUnitHelper';
import clsx from 'clsx';
import { UNIT_VIDEOS_TYPE } from '../../helpers/consts';
import UnitLogo from '../shared/Logo/UnitLogo';

const ResultUnit = ({ hit, rank, t }) => {
  const {
    _explanation: explanation,
    _score: score,
    _source: { _index: index, mdb_uid: mdbUid, result_type: resultType },
    highlight
  } = hit;

  const filters     = useSelector(state => filterSelectors.getFilters(state.filters, 'search'));
  const location    = useLocation();
  const queryResult = useSelector(state => selectors.getQueryResult(state.search));

  const { search_result: { searchId } } = queryResult;
  const cu                              = useSelector(state => mdb.getDenormContentUnit(state.mdb, mdbUid)) || {};
  const { name, content_type, id }      = cu;
  const description                     = [renderUnitHelper.getFilmDate(cu, t)];

  return (
    <Link
      onClick={() => logClick(mdbUid, index, resultType, rank, searchId)}
      to={canonicalLink(cu, getMediaLanguage(filters))}
    >
      <Segment className="bg_hover_grey search_result_item">
        {
          UNIT_VIDEOS_TYPE.includes(content_type) ? (
            <div className="search_result_img">
              <UnitLogo unitId={id} height={75} />
            </div>
          ) : iconByContentType(content_type, t)
        }
        <Container>
          <Header as="h3" content={titleFromHighlight(highlight, name)} />
          <Container className="content">{snippetFromHighlight(highlight)}</Container>
          <Container className={clsx('description', { 'is_single': !(description?.length > 1) })}>
            {description.map((d, i) => (<span key={i}>{d}</span>))}
          </Container>
          {
            isDebMode(location) && <ScoreDebug name={name} score={score} explanation={explanation} />
          }
        </Container>
      </Segment>
    </Link>
  );
};

export default withNamespaces()(ResultUnit);

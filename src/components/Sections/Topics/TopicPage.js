import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { withNamespaces } from 'react-i18next';
import { Breadcrumb, Container, Divider, Grid } from 'semantic-ui-react';
import { isLanguageRtl } from '../../../helpers/i18n-utils';
import { isEmpty } from '../../../helpers/utils';
import { actions, selectors } from '../../../redux/modules/tags';
import * as shapes from '../../shapes';
import WipErr from '../../shared/WipErr/WipErr';
import Link from '../../Language/MultiLanguageLink';
import TopN from './TopN';

const TOP_N_ITEMS = 5;

const TopicPage = ({ match, t }) => {

  const { id: tagId, language } = match.params;

  const wip = useSelector(state => selectors.getWip(state.tags));
  const error = useSelector(state => selectors.getError(state.tags));
  const sections = useSelector(state => selectors.getSections(state.tags));
  const getSectionUnits = useSelector(state => selectors.getSectionUnits(state.tags));
  const getPathByID = useSelector(state => selectors.getPathByID(state.tags));

  const dispatch = useDispatch();

  useEffect(() => {
    const fetchDashboard = tagId => dispatch(actions.fetchDashboard(tagId));

    fetchDashboard(tagId);
  }, [tagId, dispatch]);

  const wipErr = WipErr({ wip, error, t });
  if (wipErr) {
    return wipErr;
  }

  if (getPathByID && !isEmpty(sections)) {
    const tagPath = getPathByID(tagId);

    // create breadCrumb sections from tagPath
    const breadCrumbSections = [
      { id: '', label: t('nav.sidebar.topics') },
      ...tagPath,
    ].map((p, index, arr) => {
      const section = {
        key: p.id,
        content: p.label,
      };

      if (index === arr.length - 1) {
        section.active = true;
      } else {
        section.as = Link;
        section.to = `/topics/${p.id}`;
      }

      return section;
    });
    const breadCrumbIcon     = `${isLanguageRtl ? 'left' : 'right'} angle`;

    return (
      <Container className="padded">
        <Breadcrumb icon={breadCrumbIcon} sections={breadCrumbSections} size="large" />
        <Divider hidden />
        <Grid doubling columns={sections.length}>
          {
            sections.map((s) => {
              const sectionUnits = getSectionUnits(s);

              return isEmpty(sectionUnits)
                ? null
                : (
                  <Grid.Column key={s}>
                    <TopN
                      section={s}
                      units={sectionUnits}
                      N={TOP_N_ITEMS}
                      tagPath={tagPath}
                      language={language}
                    />
                  </Grid.Column>
                );
            })
          }
        </Grid>
      </Container>
    );
  }

  return (
    <div>
        Topic
      {tagId}
      {' '}
        Not Found
    </div>
  );
}

TopicPage.propTypes = {
  match: shapes.RouterMatch.isRequired,
  t: PropTypes.func.isRequired,
};

export default withRouter(withNamespaces()(TopicPage));
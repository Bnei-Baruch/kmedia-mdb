import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { withNamespaces } from 'react-i18next';
import { Breadcrumb, Container, Divider, Grid, Header } from 'semantic-ui-react';
import { isLanguageRtl } from '../../../helpers/i18n-utils';
import { isEmpty } from '../../../helpers/utils';
import { stringify as urlSearchStringify } from '../../../helpers/url';
import { filtersTransformer } from '../../../filters/index';
import { actions, selectors } from '../../../redux/modules/tags';
import { selectors as settings } from '../../../redux/modules/settings';
import * as shapes from '../../shapes';
import WipErr from '../../shared/WipErr/WipErr';
import Link from '../../Language/MultiLanguageLink';
import TopN from './TopN';
import HelmetsBasic from '../../shared/Helmets/Basic';

const TOP_N_ITEMS = 5;

const getTopicUrl = (section, tagPath, language) => {
  const query = tagPath
    ? filtersTransformer
      .toQueryParams([{ name: 'topics-filter', values: [tagPath.map(y => y.id)] }])
    : '';

  const realSection = section === 'publications'
    ? 'publications/articles'
    : section;

  return `/${language}/${realSection}?${urlSearchStringify(query)}`;
};

const getBreadCrumbSection = (p, index, arr) => {
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
};

const TopicPage = ({ match, t }) => {
  const wip             = useSelector(state => selectors.getWip(state.tags));
  const error           = useSelector(state => selectors.getError(state.tags));
  const sections        = useSelector(state => selectors.getSections(state.tags));
  const getSectionUnits = useSelector(state => selectors.getSectionUnits(state.tags));
  const getCounts       = useSelector(state => selectors.getCounts(state.tags));
  const getPathByID     = useSelector(state => selectors.getPathByID(state.tags));
  const getTags         = useSelector(state => selectors.getTags(state.tags));
  const language        = useSelector(state => settings.getLanguage(state.settings));

  const dispatch = useDispatch();

  const tagId = match.params.id;

  useEffect(() => {
    dispatch(actions.fetchDashboard(tagId));
  }, [tagId, language, dispatch]);

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
    ].map(getBreadCrumbSection);

    const breadCrumbIcon = `${isLanguageRtl(language) ? 'left' : 'right'} angle`;

    return (
      <>
        <HelmetsBasic title={breadCrumbSections[breadCrumbSections.length - 1]?.content} />
        <Container className="padded">
          <Breadcrumb icon={breadCrumbIcon} sections={breadCrumbSections} size="large" />
          <Divider hidden />
          <Grid doubling columns={sections.length}>
            {
              sections.map(s => {
                const sectionUnits = getSectionUnits(s);
                const topicUrl     = getTopicUrl(s, tagPath, language);
                const sectionCount = getCounts(s);

                return isEmpty(sectionUnits)
                  ? null
                  : (
                    <Grid.Column key={s}>
                      <TopN
                        section={s}
                        units={sectionUnits}
                        N={TOP_N_ITEMS}
                        topicUrl={topicUrl}
                        sectionCount={sectionCount}
                      />
                    </Grid.Column>
                  );
              })
            }
          </Grid>
        </Container>
      </>
    );
  }

  const tag = getTags ? getTags[tagId] : null;

  return (
    <Container className="padded">
      <Header as="h3">
        {t(`nav.sidebar.topic`)}
        {' "'}
        {tag ? tag.label : tagId}
        {'" '}
        {t(`nav.sidebar.not-found`)}
      </Header>
    </Container>
  );
};

TopicPage.propTypes = {
  match: shapes.RouterMatch.isRequired,
  t: PropTypes.func.isRequired,
};

export default withRouter(withNamespaces()(TopicPage));

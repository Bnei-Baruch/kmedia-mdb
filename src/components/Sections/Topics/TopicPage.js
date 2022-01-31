import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { withNamespaces } from 'react-i18next';
import { Breadcrumb, Container, Divider, Grid, Header } from 'semantic-ui-react';
import { isLanguageRtl } from '../../../helpers/i18n-utils';
import { isEmpty } from '../../../helpers/utils';

import { actions, selectors } from '../../../redux/modules/mdb';
import { selectors as tagSelectors } from '../../../redux/modules/tags';
import { selectors as settings } from '../../../redux/modules/settings';
import WipErr from '../../shared/WipErr/WipErr';
import Link from '../../Language/MultiLanguageLink';
import HelmetsBasic from '../../shared/Helmets/Basic';
import TextList from './TextsList';
import VideoList from './VideoList';

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

const TopicPage = ({ t }) => {
  const getPathByID     = useSelector(state => tagSelectors.getPathByID(state.tags));
  const getTags         = useSelector(state => tagSelectors.getTags(state.tags));
  const language        = useSelector(state => settings.getLanguage(state.settings));
  const cusByTag        = useSelector(state => selectors.skipFetchedCO(state.my));
  const { wip, errors } = cusByTag;

  const dispatch = useDispatch();

  const { id } = useParams();

  useEffect(() => {
    dispatch(actions.cusByTag({ tag: id }));
  }, [id, language, dispatch]);

  const wipErr = WipErr({ wip, errors, t });
  if (wipErr) {
    return wipErr;
  }

  if (getPathByID && !isEmpty(cusByTag.byType)) {
    const tagPath = getPathByID(id);

    // create breadCrumb sections from tagPath
    const breadCrumbSections = [
      { id: '', label: t('nav.sidebar.topics') },
      ...tagPath,
    ].map(getBreadCrumbSection);

    const breadCrumbIcon = `${isLanguageRtl(language) ? 'left' : 'right'} angle`;

    return (
      <>
        <HelmetsBasic title={breadCrumbSections[breadCrumbSections.length - 1]?.content} />
        <Container className="padded topics">
          <Breadcrumb icon={breadCrumbIcon} sections={breadCrumbSections} size="large" />
          <Divider hidden />
          <Grid>
            <Grid.Column width="7">
              <TextList cusByType={cusByTag.byType} />
            </Grid.Column>
            <Grid.Column width="9">
              <VideoList cusByType={cusByTag.byType} />
            </Grid.Column>
          </Grid>
        </Container>
      </>
    );
  }

  const tag = getTags ? getTags[id] : null;

  return (
    <Container className="padded">
      <Header as="h3">
        {t(`nav.sidebar.topic`)}
        {' "'}
        {tag ? tag.label : id}
        {'" '}
        {t(`nav.sidebar.not-found`)}
      </Header>
    </Container>
  );
};

TopicPage.propTypes = {
  t: PropTypes.func.isRequired,
};

export default withNamespaces()(TopicPage);

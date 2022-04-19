import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { withNamespaces } from 'react-i18next';
import { Breadcrumb, Container, Divider, Grid } from 'semantic-ui-react';
import { isLanguageRtl } from '../../../helpers/i18n-utils';

import { selectors } from '../../../redux/modules/tags';
import { selectors as settings } from '../../../redux/modules/settings';
import Filters from './Filters';
import VideoList from './VideoList';
import TextList from './TextList';
import FilterLabels from '../../FiltersAside/FilterLabels';
import HelmetsBasic from '../../shared/Helmets/Basic';
import { getBreadCrumbSection } from './helper';

const RenderPage = ({ t }) => {
  const { id } = useParams();

  const getPathByID = useSelector(state => selectors.getPathByID(state.tags));
  const language    = useSelector(state => settings.getLanguage(state.settings));

  const tagPath = getPathByID(id);

  // create breadCrumb sections from tagPath
  const breadCrumbSections = [{ id: '', label: t('nav.sidebar.topics') }, ...tagPath].map(getBreadCrumbSection);

  const breadCrumbIcon = `${isLanguageRtl(language) ? 'left' : 'right'} angle`;

  return (
    <>
      <HelmetsBasic title={breadCrumbSections[breadCrumbSections.length - 1]?.content} />
      <Container className="padded topics">
        <Breadcrumb icon={breadCrumbIcon} sections={breadCrumbSections} size="huge" />
        <Divider />
        <Grid divided>
          <Grid.Column width="4" className="filters-aside-wrapper">
            <Filters
              namespace={`topics_${id}`}
              baseParams={{ tag: id }}
            />
          </Grid.Column>
          <Grid.Column width="12">
            <FilterLabels namespace={`topics_${id}`} />
            <Grid>
              <Grid.Column width="10">
                <VideoList />
              </Grid.Column>
              <Grid.Column width="6">
                <TextList />
              </Grid.Column>
            </Grid>
          </Grid.Column>
        </Grid>
      </Container>
    </>
  );
};

RenderPage.propTypes = {
  t: PropTypes.func.isRequired,
};

export default withNamespaces()(RenderPage);

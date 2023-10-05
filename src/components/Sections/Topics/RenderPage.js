import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'next-i18next';
import { Breadcrumb, Container, Divider, Grid } from 'semantic-ui-react';
import { isLanguageRtl } from '../../../helpers/i18n-utils';

import { selectors } from '../../../../lib/redux/slices/tagsSlice/tagsSlice';
import { selectors as settings } from '../../../../lib/redux/slices/settingsSlice/settingsSlice';
import Filters from './Filters';
import VideoList from './VideoList';
import TextList from './TextList';
import FilterLabels from '../../../../lib/filters/components/FilterLabels';
import HelmetsBasic from '../../shared/Helmets/Basic';
import { getBreadCrumbSection } from './helper';

const RenderPage = () => {
  const { id } = useParams();
  const { t }  = useTranslation();

  const getPathByID = useSelector(state => selectors.getPathByID(state.tags));
  const uiLang      = useSelector(state => settings.getUILang(state.settings));

  const tagPath = getPathByID(id);

  // create breadCrumb sections from tagPath
  const breadCrumbSections = [{ id: '', label: t('nav.sidebar.topics') }, ...tagPath].map(getBreadCrumbSection);

  const breadCrumbIcon = `${isLanguageRtl(uiLang) ? 'left' : 'right'} angle`;
  const baseParams     = useMemo(() => ({ tag: id }), [id]);

  return (
    <>
      <HelmetsBasic title={breadCrumbSections[breadCrumbSections.length - 1]?.content} />
      <Container className="padded topics" fluid>
        <Breadcrumb icon={breadCrumbIcon} sections={breadCrumbSections} size="huge" />
        <Divider />
        <Grid divided>
          <Grid.Column width="4" className="filters-aside-wrapper">
            <Filters
              namespace={`topics_${id}`}
              baseParams={baseParams}
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
export default RenderPage;

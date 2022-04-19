import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { withNamespaces } from 'react-i18next';
import { Breadcrumb, Button, Container, Divider, Modal } from 'semantic-ui-react';
import { isLanguageRtl } from '../../../helpers/i18n-utils';

import { selectors } from '../../../redux/modules/tags';
import { selectors as settings } from '../../../redux/modules/settings';
import Filters from './Filters';
import VideoList from './VideoList';
import TextList from './TextList';
import FilterLabels from '../../FiltersAside/FilterLabels';
import HelmetsBasic from '../../shared/Helmets/Basic';
import { getBreadCrumbSection } from './helper';

const RenderPageMobile = ({ t }) => {
  const { id } = useParams();

  const [openFilters, setOpenFilters] = useState(false);

  const getPathByID = useSelector(state => selectors.getPathByID(state.tags));
  const language    = useSelector(state => settings.getLanguage(state.settings));

  const tagPath = getPathByID(id);

  // create breadCrumb sections from tagPath
  const breadCrumbSections = [{ id: '', label: t('nav.sidebar.topics') }, ...tagPath].map(getBreadCrumbSection);

  const breadCrumbIcon = `${isLanguageRtl(language) ? 'left' : 'right'} angle`;

  return (
    <>
      <Modal
        closeIcon
        open={openFilters}
        onClose={() => setOpenFilters(false)}
      >
        <Modal.Content className="filters-aside-wrapper">
          <Filters
            namespace={`topics_${id}`}
            baseParams={{ tag: id }}
          />
        </Modal.Content>
      </Modal>
      <HelmetsBasic title={breadCrumbSections[breadCrumbSections.length - 1]?.content} />
      <Container className="padded topics">
        <Breadcrumb icon={breadCrumbIcon} sections={breadCrumbSections} size="huge" />
        <Button className="" basic icon="filter" floated={'right'} onClick={() => setOpenFilters(true)} />
        <Divider />
        <FilterLabels namespace={`topics_${id}`} />
        <VideoList />
        <TextList />
      </Container>
    </>
  );
};

RenderPageMobile.propTypes = {
  t: PropTypes.func.isRequired,
};

export default withNamespaces()(RenderPageMobile);

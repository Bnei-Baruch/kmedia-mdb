import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'next-i18next';
import { Breadcrumb, Button, Container, Divider, Modal } from 'semantic-ui-react';

import { selectors } from '../../../../lib/redux/slices/tagsSlice/tagsSlice';
import { selectors as settings } from '../../../../lib/redux/slices/settingsSlice/settingsSlice';
import Filters from './Filters';
import VideoList from './VideoList';
import TextList from './TextList';
import FilterLabels from '../../../../lib/filters/components/FilterLabels';
import HelmetsBasic from '../../shared/Helmets/Basic';
import { getBreadCrumbSection } from './helper';

const RenderPageMobile = () => {
  const { id } = useParams();
  const { t }  = useTranslation();

  const [openFilters, setOpenFilters] = useState(false);

  const getPathByID = useSelector(state => selectors.getPathByID(state.tags));
  const uiDir       = useSelector(state => settings.getUIDir(state.settings));

  const tagPath = getPathByID(id);

  // create breadCrumb sections from tagPath
  const breadCrumbSections = [{ id: '', label: t('nav.sidebar.topics') }, ...tagPath].map(getBreadCrumbSection);

  const breadCrumbIcon = `${uiDir === 'rtl' ? 'left' : 'right'} angle`;
  const closeFilters   = () => setOpenFilters(false);
  return (
    <>
      <Modal
        closeIcon
        open={openFilters}
        onClose={closeFilters}
        dir={uiDir}
        className={uiDir}
      >
        <Modal.Content className="filters-aside-wrapper" scrolling>
          <Filters
            namespace={`topics_${id}`}
            baseParams={{ tag: id }}
          />
        </Modal.Content>
        <Modal.Actions>
          <Button primary content={t('buttons.close')} onClick={closeFilters} />
        </Modal.Actions>
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

export default RenderPageMobile;

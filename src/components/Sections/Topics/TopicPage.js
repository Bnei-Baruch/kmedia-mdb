import React, { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { withNamespaces } from 'react-i18next';
import { Breadcrumb, Container, Divider, Grid, Header } from 'semantic-ui-react';
import { isLanguageRtl } from '../../../helpers/i18n-utils';

import { actions, selectors } from '../../../redux/modules/tags';
import { selectors as settings } from '../../../redux/modules/settings';
import { selectors as mdb } from '../../../redux/modules/mdb';
import Link from '../../Language/MultiLanguageLink';
import HelmetsBasic from '../../shared/Helmets/Basic';

import { extractByMediaType } from './helper';
import TextItem from './TextItem';
import ContentItemContainer from '../../shared/ContentItem/ContentItemContainer';
import Pagination from '../../Pagination/Pagination';
import Filters from './Filters';
import { selectors as filters } from '../../../redux/modules/filters';
import { FN_CONTENT_TYPE, FN_LANGUAGES, FN_SOURCES_MULTI } from '../../../helpers/consts';
import VideoList from './VideoList';
import TextList from './TextList';

const TOPIC_PAGE_SIZE = 10;

const getBreadCrumbSection = (p, index, arr) => {
  if (!p) return arr;
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
  const { id } = useParams();

  const [pageNo, setPageNo] = useState(0);

  const getPathByID = useSelector(state => selectors.getPathByID(state.tags));
  const getTags     = useSelector(state => selectors.getTags(state.tags));
  const language    = useSelector(state => settings.getLanguage(state.settings));
  const filterNames = [FN_SOURCES_MULTI, FN_CONTENT_TYPE, FN_LANGUAGES];
  const selected    = useSelector(state => filterNames.map(fn => filters.getFilterByName(state.filters, `topics_${id}`, fn)?.values || [])).flat();

  const { mediaTotal, textTotal } = useSelector(state => selectors.getItems(state.tags));
  const total                                 = Math.max(mediaTotal, textTotal);


  const dispatch = useDispatch();

  useEffect(() => {
    const page_no = pageNo > 1 ? pageNo : 1;
    dispatch(actions.fetchDashboard({ tag: id, page_size: TOPIC_PAGE_SIZE, page_no }));
  }, [id, language, dispatch, pageNo, selected?.length]);

  /*
    const wipErr = WipErr({ wip, error, t });
    if (wipErr) {
      return wipErr;
    }
  */

  if (getPathByID) {
    const tagPath = getPathByID(id);

    // create breadCrumb sections from tagPath
    const breadCrumbSections = [
      { id: '', label: t('nav.sidebar.topics') },
      ...tagPath,
    ].map(getBreadCrumbSection);

    const breadCrumbIcon = `${isLanguageRtl(language) ? 'left' : 'right'} angle`;

    const onPageChange = n => {
      setPageNo(n);
    };

    return (
      <>
        <HelmetsBasic title={breadCrumbSections[breadCrumbSections.length - 1]?.content} />
        <Container className="padded topics">
          <Breadcrumb icon={breadCrumbIcon} sections={breadCrumbSections} size="large" />
          <Divider hidden />
          <Grid>
            <Grid.Column width="4">
              <Filters
                namespace={`topics_${id}`}
                baseParams={{ tag: id }}
              />
            </Grid.Column>
            <Grid.Column width="5">
              <TextList />
            </Grid.Column>
            <Grid.Column width="7">
              <VideoList />
            </Grid.Column>
          </Grid>
        </Container>
        <Divider fitted />
        <Container className="padded pagination-wrapper" textAlign="center">
          {
            total > 0 &&
            <Pagination
              pageNo={pageNo}
              pageSize={TOPIC_PAGE_SIZE}
              total={total}
              language={language}
              onChange={onPageChange}
            />
          }
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

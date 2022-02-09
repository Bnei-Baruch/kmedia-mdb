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

const TOPIC_PAGE_SIZE = 10;

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
  const [pageNo, setPageNo] = useState(0);

  const getPathByID = useSelector(state => selectors.getPathByID(state.tags));
  const getTags     = useSelector(state => selectors.getTags(state.tags));
  const language    = useSelector(state => settings.getLanguage(state.settings));
  const denormCU    = useSelector(state => mdb.nestedGetDenormContentUnit(state.mdb));
  const denormLabel = useSelector(state => mdb.getDenormLabel(state.mdb));

  const { items: ids, mediaTotal, textTotal } = useSelector(state => selectors.getItems(state.tags));
  const total                                 = Math.max(mediaTotal, textTotal);
  const items                                 = ids?.map(({ cuID, lID }) => ({
    cu: denormCU(cuID),
    label: denormLabel(lID)
  })) || [];

  const { texts, medias } = useMemo(() => extractByMediaType(items), [items]);

  const dispatch = useDispatch();

  const { id } = useParams();

  useEffect(() => {
    dispatch(actions.fetchDashboard({ id, page_size: TOPIC_PAGE_SIZE, page_no: pageNo === 0 ? 0 : pageNo - 1 }));
  }, [id, language, dispatch, pageNo]);

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

    const mediaTile = `${t('nav.sidebar.lessons')}, ${t('nav.sidebar.events')}, ${t('nav.sidebar.programs')} (${mediaTotal})`;
    const textTile  = `${t('nav.sidebar.publications')}, ${t('nav.sidebar.books')}, ${t('nav.sidebar.likutim')} (${textTotal})`;

    return (
      <>
        <HelmetsBasic title={breadCrumbSections[breadCrumbSections.length - 1]?.content} />
        <Container className="padded topics">
          <Breadcrumb icon={breadCrumbIcon} sections={breadCrumbSections} size="large" />
          <Divider hidden />
          <Grid>
            <Grid.Column width="7">
              <Container className="padded topics_texts">
                <Header as="h3" content={textTile} />
                {
                  texts.map((x, i) => (<TextItem item={x} key={i} />))
                }
              </Container>
            </Grid.Column>
            <Grid.Column width="9">
              <Container className="padded topics_media">
                <Header content={mediaTile} />
                {
                  medias.map((x, i) =>
                    <ContentItemContainer id={x.cu.id} size="small" asList={true} key={i} />
                  )
                }
              </Container>
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

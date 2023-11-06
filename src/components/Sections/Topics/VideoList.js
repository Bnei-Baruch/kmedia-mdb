import React from 'react';
import { useTranslation } from 'next-i18next';
import { Container, Header } from 'semantic-ui-react';

import ContentItem from '../../../../app/components/ContentItem/ContentItem';
import CollectionListTemplate from '../../../../app/components/ContentItem/CollectionListTemplate';
import { useSelector } from 'react-redux';
import { selectors } from '../../../../lib/redux/slices/tagsSlice/tagsSlice';

const VideoList = () => {
  const { t }                      = useTranslation();
  const { items: ids, mediaTotal } = useSelector(state => selectors.getItems(state.tags));

  const items = ids?.filter(x => !x.isText).filter(x => !!x.cuID || !!x.cID) || [];
  const title = `${t('nav.sidebar.lessons')}, ${t('nav.sidebar.events')}, ${t('nav.sidebar.programs')} (${mediaTotal})`;

  return (
    <Container className="padded topics_media">
      <Header content={title} />
      {
        items?.map((x, i) => {
          if (x.lID) {
            return <ContentItem id={x.cuID} size="small" lID={x.lID} asList={true} key={i} />;
          }
          if (x.cID)
            return <CollectionListTemplate cID={x.cID} size="small" key={i} />;
          return <ContentItem id={x.cuID} size="small" asList={true} key={i} />;
        })
      }
    </Container>

  );
};

export default VideoList;

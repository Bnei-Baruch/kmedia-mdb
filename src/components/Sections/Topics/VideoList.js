import React from 'react';
import { useTranslation } from 'react-i18next';
import { Container, Header } from 'semantic-ui-react';

import ContentItemContainer from '../../shared/ContentItem/ContentItemContainer';
import CollectionListTemplate from '../../shared/ContentItem/CollectionListTemplate';
import { useSelector } from 'react-redux';
import { selectors } from '../../../redux/modules/tags';

const VideoList = () => {
  const { items: ids, mediaTotal } = useSelector(state => selectors.getItems(state.tags));
  const { t }                      = useTranslation();

  const items = ids?.filter(x => !x.isText).filter(x => !!x.cuID || !!x.cID) || [];
  const title = `${t('nav.sidebar.lessons')}, ${t('nav.sidebar.events')}, ${t('nav.sidebar.programs')} (${mediaTotal})`;

  return (
    <Container className="padded topics_media">
      <Header content={title} />
      {
        items?.map((x, i) => {
          if (x.cID)
            return <CollectionListTemplate cID={x.cID} size="small" key={i} />;
          return <ContentItemContainer id={x.cuID} size="small" asList={true} key={i} />;
        })
      }
    </Container>

  );
};

export default VideoList;

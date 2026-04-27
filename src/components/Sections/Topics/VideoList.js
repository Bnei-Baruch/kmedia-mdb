import React from 'react';
import { useTranslation } from 'react-i18next';

import ContentItemContainer from '../../shared/ContentItem/ContentItemContainer';
import CollectionListTemplate from '../../shared/ContentItem/CollectionListTemplate';
import { useSelector } from 'react-redux';
import { tagsGetItemsSelector } from '../../../redux/selectors';

const VideoList = () => {
  const { t }                      = useTranslation();
  const { items: ids, mediaTotal } = useSelector(tagsGetItemsSelector);

  const items = ids?.filter(x => !x.isText).filter(x => !!x.cuID || !!x.cID) || [];
  const title = `${t('nav.sidebar.lessons')}, ${t('nav.sidebar.events')}, ${t('nav.sidebar.programs')} (${mediaTotal})`;

  return (
    <div className=" px-4  topics_media">
      <h3>{title}</h3>
      {
        items?.map((x, i) => {
          if (x.lID) {
            return <ContentItemContainer id={x.cuID} size="small" lID={x.lID} asList={true} key={i}/>;
          }

          if (x.cID)
            return <CollectionListTemplate cID={x.cID} size="small" key={i}/>;
          return <ContentItemContainer id={x.cuID} size="small" asList={true} key={i}/>;
        })
      }
    </div>

  );
};

export default VideoList;

import React from 'react';
import PropTypes from 'prop-types';
import { withNamespaces } from 'react-i18next';
import { Container, Header } from 'semantic-ui-react';

import ContentItemContainer from '../../shared/ContentItem/ContentItemContainer';
import { useSelector } from 'react-redux';
import { selectors } from '../../../redux/modules/tags';
import { selectors as mdb } from '../../../redux/modules/mdb';

const VideoList = ({ t }) => {
  const denormCU    = useSelector(state => mdb.nestedGetDenormContentUnit(state.mdb));
  const denormLabel = useSelector(state => mdb.getDenormLabel(state.mdb));

  const { items: ids, mediaTotal } = useSelector(state => selectors.getItems(state.tags));

  const items = ids?.filter(x => !x.isText).map(({ cuID, lID }) => ({
    cu: denormCU(cuID),
    label: denormLabel(lID)
  })).filter(x => !!x.cu) || [];
  const title = `${t('nav.sidebar.lessons')}, ${t('nav.sidebar.events')}, ${t('nav.sidebar.programs')} (${mediaTotal})`;

  return (
    <Container className="padded topics_media">
      <Header content={title} />
      {
        items?.map((x, i) => (
          <ContentItemContainer id={x.cu.id} size="small" asList={true} key={i} />
        ))
      }
    </Container>

  );
};

VideoList.propTypes = {
  t: PropTypes.func.isRequired,
};

export default withNamespaces()(VideoList);

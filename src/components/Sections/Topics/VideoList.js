import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { withNamespaces } from 'react-i18next';
import { Container, List } from 'semantic-ui-react';

import ContentItemContainer from '../../shared/ContentItem/ContentItemContainer';
import { extractByMediaType } from './helper';

const VideoList = ({ t, cusByType }) => {

  const items = useMemo(() => extractByMediaType(cusByType, false), [cusByType]);

  return (
    <Container className="padded">
      <List>
        <List.Header>{t('topic.videoTitle')}</List.Header>
        {
          items?.map((x, i) => (
            <ContentItemContainer id={x.content_unit_uid} size="small" asList={true} key={i} />
          ))
        }
      </List>
    </Container>
  );
};

VideoList.propTypes = {
  t: PropTypes.func.isRequired,
};

export default withNamespaces()(VideoList);

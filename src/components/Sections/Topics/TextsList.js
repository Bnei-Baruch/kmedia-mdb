import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { withNamespaces } from 'react-i18next';
import { Container, Header } from 'semantic-ui-react';
import TextItem from './TextItem';
import { extractByMediaType } from './helper';

const TextList = ({ t, cusByType }) => {

  const items = useMemo(() => extractByMediaType(cusByType, true), [cusByType]);

  return (
    <Container className="padded topics_texts">
      <Header as="h3">{t('topic.textTitle')}</Header>
      {
        items?.map((x, i) => (<TextItem item={x} key={i} />))
      }
    </Container>
  );
};

TextList.propTypes = {
  t: PropTypes.func.isRequired,
};

export default withNamespaces()(TextList);

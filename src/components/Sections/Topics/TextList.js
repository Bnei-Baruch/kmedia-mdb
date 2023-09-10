import React from 'react';
import { useSelector } from 'react-redux';
import { withTranslation } from 'next-i18next';
import { Container, Header } from 'semantic-ui-react';
import PropTypes from 'prop-types';

import { selectors } from '../../../../lib/redux/slices/tagsSlice/tagsSlice';
import TextListTemplate from '../../shared/ContentItem/TextListTemplate';

const TextList = ({ t }) => {

  const { items: ids, textTotal } = useSelector(state => selectors.getItems(state.tags));

  const items = ids?.filter(x => !!x.isText) || [];

  return (
    <Container className="padded topics_texts">
      <Header as="h3" content={`${t('topics.texts-title')} (${textTotal})`} />
      {
        items?.map(({ cuID, lID }, i) => (<TextListTemplate cuID={cuID} lID={lID} key={i} />))
      }
    </Container>
  );
};

TextList.propTypes = {
  t: PropTypes.func.isRequired,
};

export default withTranslation()(TextList);

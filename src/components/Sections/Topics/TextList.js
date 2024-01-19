import React from 'react';
import { useSelector } from 'react-redux';
import { withTranslation } from 'react-i18next';
import { Container, Header } from 'semantic-ui-react';
import PropTypes from 'prop-types';

import TextListTemplate from '../../shared/ContentItem/TextListTemplate';
import { tagsGetItemsSelector } from '../../../redux/selectors';

const TextList = ({ t }) => {

  const { items: ids, textTotal } = useSelector(tagsGetItemsSelector);

  const items = ids?.filter(x => !!x.isText) || [];

  return (
    <Container className="padded topics_texts">
      <Header as="h3" content={`${t('topics.texts-title')} (${textTotal})`}/>
      {
        items?.map(({ cuID, lID }, i) => (<TextListTemplate cuID={cuID} lID={lID} key={i}/>))
      }
    </Container>
  );
};

TextList.propTypes = {
  t: PropTypes.func.isRequired
};

export default withTranslation()(TextList);

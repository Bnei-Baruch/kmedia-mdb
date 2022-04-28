import React from 'react';
import { useSelector } from 'react-redux';
import { withNamespaces } from 'react-i18next';
import { Container, Header } from 'semantic-ui-react';
import PropTypes from 'prop-types';

import { selectors } from '../../../redux/modules/tags';
import { selectors as mdb } from '../../../redux/modules/mdb';
import TextListTemplate from '../../shared/ContentItem/TextListTemplate';

const TextList = ({ t }) => {
  const denormCU    = useSelector(state => mdb.nestedGetDenormContentUnit(state.mdb));
  const denormLabel = useSelector(state => mdb.getDenormLabel(state.mdb));

  const { items: ids, textTotal } = useSelector(state => selectors.getItems(state.tags));

  const items = ids?.filter(x => !!x.isText).map(({ cuID, lID }) => ({
    cu: denormCU(cuID),
    label: denormLabel(lID)
  })).filter(x => !!x.cu) || [];

  return (
    <Container className="padded topics_texts">
      <Header as="h3" content={`${t('topics.texts-title')} (${textTotal})`} />
      {
        items?.map(({ label, cu }, i) => (<TextListTemplate unit={cu} label={label} key={i} />))
      }
    </Container>
  );
};

TextList.propTypes = {
  t: PropTypes.func.isRequired,
};

export default withNamespaces()(TextList);

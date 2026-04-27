import React from 'react';
import { useSelector } from 'react-redux';
import { withTranslation } from 'react-i18next';
import PropTypes from 'prop-types';

import TextListTemplate from '../../shared/ContentItem/TextListTemplate';
import { tagsGetItemsSelector } from '../../../redux/selectors';

const TextList = ({ t }) => {

  const { items: ids, textTotal } = useSelector(tagsGetItemsSelector);

  const items = ids?.filter(x => !!x.isText) || [];

  return (
    <div className=" px-4  topics_texts">
      <h3>{`${t('topics.texts-title')} (${textTotal})`}</h3>
      {
        items?.map(({ cuID, lID }, i) => (<TextListTemplate cuID={cuID} lID={lID} key={i}/>))
      }
    </div>
  );
};

TextList.propTypes = {
  t: PropTypes.func.isRequired
};

export default withTranslation()(TextList);

import React from 'react';
import PropTypes from 'prop-types';
import { withTranslation, useTranslation } from 'next-i18next';
import { Image, List } from 'semantic-ui-react';
import { useSelector } from 'react-redux';

import WipErr from '../../shared/WipErr/WipErr';
import { FrownSplash } from '../../shared/Splash/Splash';
import { selectors } from '../../../../lib/redux/slices/simpleMode/simpleModeSlice';
import { selectors as mdb } from '../../../../lib/redux/slices/mdbSlice/mdbSlice';
import { isEmpty } from '../../../helpers/utils';
import { SectionLogo } from '../../../helpers/images';

const SimpleModeList = ({ filesLanguages, renderUnit }) => {
  const { t }      = useTranslation();
  const reduxItems = useSelector(state => selectors.getItems(state.simpleMode));
  const lessons    = useSelector(state => reduxItems.lessons.map(x => mdb.getDenormCollectionWUnits(state.mdb, x)).filter(x => !isEmpty(x)));
  const others     = useSelector(state => reduxItems.others.map(x => mdb.getDenormContentUnit(state.mdb, x)).filter(x => !isEmpty(x)));

  if (lessons.length === 0 && others.length === 0) {
    return <FrownSplash text={t('simple-mode.no-files-found-for-date')} />;
  }

  return (
    <div>
      {
        lessons.length > 0 &&
        <div>
          <h2>
            <Image className="simple-mode-type-icon">
              <SectionLogo name="lessons" />
            </Image>
            {t('simple-mode.today-lessons')}
          </h2>
          <List size="large">
            {lessons.map(x => renderUnit(x, filesLanguages, t))}
          </List>
        </div>
      }
      {
        others.length > 0 &&
        <List size="large">
          {renderUnit(others, filesLanguages, t)}
        </List>
      }
    </div>
  );
};

SimpleModeList.propTypes = {
  filesLanguages: PropTypes.arrayOf(PropTypes.string).isRequired,
  renderUnit: PropTypes.func.isRequired,
};

export default SimpleModeList;

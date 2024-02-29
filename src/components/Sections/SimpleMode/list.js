import React from 'react';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import { Image, List } from 'semantic-ui-react';
import { useSelector } from 'react-redux';

import WipErr from '../../shared/WipErr/WipErr';
import { FrownSplash } from '../../shared/Splash/Splash';
import { isEmpty } from '../../../helpers/utils';
import { SectionLogo } from '../../../helpers/images';
import { mdbGetDenormCollectionWUnitsSelector, mdbGetDenormContentUnitSelector, simpleModeGetItemsSelector, simpleModeGetErrorSelector, simpleModeGetWipSelector } from '../../../redux/selectors';

const SimpleModeList = ({ filesLanguages, t, renderUnit }) => {
  const wip        = useSelector(simpleModeGetWipSelector);
  const err        = useSelector(simpleModeGetErrorSelector);
  const reduxItems = useSelector(simpleModeGetItemsSelector);
  const lessons    = useSelector(state => reduxItems.lessons.map(x => mdbGetDenormCollectionWUnitsSelector(state, x)).filter(x => !isEmpty(x)));
  const others     = useSelector(state => reduxItems.others.map(x => mdbGetDenormContentUnitSelector(state, x)).filter(x => !isEmpty(x)));

  const wipErr = WipErr({ wip, err, t });
  if (wipErr) {
    return wipErr;
  }

  if (lessons.length === 0 && others.length === 0) {
    return <FrownSplash text={t('simple-mode.no-files-found-for-date')}/>;
  }

  return (
    <div>
      {
        lessons.length > 0 &&
        <div>
          <h2>
            <Image className="simple-mode-type-icon">
              <SectionLogo name="lessons"/>
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
  t             : PropTypes.func.isRequired,
  renderUnit    : PropTypes.func.isRequired
};

export default withTranslation()(SimpleModeList);

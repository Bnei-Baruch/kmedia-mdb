import React from 'react';
import PropTypes from 'prop-types';
import { withNamespaces } from 'react-i18next';
import { Image, List } from 'semantic-ui-react';
import { useSelector } from 'react-redux';

import WipErr from '../../shared/WipErr/WipErr';
import { FrownSplash } from '../../shared/Splash/Splash';
import { selectors } from '../../../redux/modules/simpleMode';
import { selectors as mdb } from '../../../redux/modules/mdb';
import { isEmpty } from '../../../helpers/utils';
import { SectionLogo } from '../../../helpers/images';

const SimpleModeList = ({ language, t, renderUnit }) => {
  const wip = useSelector(state => selectors.getWip(state.simpleMode));
  const err = useSelector(state => selectors.getError(state.simpleMode));
  const reduxItems = useSelector(state => selectors.getItems(state.simpleMode));
  const lessons = useSelector(state => reduxItems.lessons.map(x => mdb.getDenormCollectionWUnits(state.mdb, x)).filter(x => !isEmpty(x)));
  const others = useSelector(state => reduxItems.others.map(x => mdb.getDenormContentUnit(state.mdb, x)).filter(x => !isEmpty(x)));

  const wipErr = WipErr({ wip, err, t });
  if (wipErr) {
    return wipErr;
  }

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
                <SectionLogo name='lessons' />
              </Image>
              {t('simple-mode.today-lessons')}
            </h2>
            <List size="large">
              {lessons.map(x => renderUnit(x, language, t))}
            </List>
          </div>
      }
      {
        others.length > 0 &&
          <List size="large">
            {renderUnit(others, language, t)}
          </List>
      }
    </div>
  );
};

SimpleModeList.propTypes = {
  language: PropTypes.string.isRequired,
  t: PropTypes.func.isRequired,
  renderUnit: PropTypes.func.isRequired,
};

export default withNamespaces()(SimpleModeList);

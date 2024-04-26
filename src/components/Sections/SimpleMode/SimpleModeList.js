import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { Image, List } from 'semantic-ui-react';
import { useSelector } from 'react-redux';

import WipErr from '../../shared/WipErr/WipErr';
import { FrownSplash } from '../../shared/Splash/Splash';
import { isEmpty, isToday, noop } from '../../../helpers/utils';
import { SectionLogo } from '../../../helpers/images';
import {
  mdbGetDenormCollectionWUnitsSelector,
  mdbGetDenormContentUnitSelector,
  settingsGetUILangSelector
} from '../../../redux/selectors';
import { useSimpleModeQuery } from '../../../redux/api/simpleMode';
import { useInterval } from '../../../helpers/timer';

const SimpleModeList = ({ filesLanguages, renderUnit, selectedDate }) => {
  const { t }      = useTranslation();
  const uiLanguage = useSelector(settingsGetUILangSelector);

  const { isError, isLoading, isSuccess, error, data, refetch } = useSimpleModeQuery({
    date            : selectedDate,
    uiLanguage,
    contentLanguages: filesLanguages
  });

  const callback = useCallback(() => isToday(selectedDate) ? refetch : noop, [selectedDate, refetch]);
  useInterval(callback, 60 * 1000);

  const dataLessons = isSuccess ? data.lessons : [];
  const dataOthers  = isSuccess ? data.others : [];
  const lessons     = useSelector(state => dataLessons.map(x => mdbGetDenormCollectionWUnitsSelector(state, x.id)).filter(x => !isEmpty(x)));
  const others      = useSelector(state => dataOthers.map(x => mdbGetDenormContentUnitSelector(state, x.id)).filter(x => !isEmpty(x)));

  const wipErr = WipErr({ wip: isLoading, err: isError, t });
  if (wipErr) {
    if (error) {
      console.error('========> SimpleModeList error', error);
    }

    return wipErr;
  }

  if (!isSuccess|| (lessons.length === 0 && others.length === 0)) {
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
  renderUnit    : PropTypes.func.isRequired,
  selectedDate  : PropTypes.string.isRequired,
};

export default SimpleModeList;

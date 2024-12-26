import React, { useEffect, useState } from 'react';
import { Segment, Divider } from 'semantic-ui-react';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { selectSuitableLanguage } from '../../../../../../helpers/language';
import { actions as assetsActions } from '../../../../../../redux/modules/assets';
import MenuLanguageSelector from '../../../../../../components/Language/Selector/MenuLanguageSelector';
import {
  settingsGetContentLanguagesSelector,
  assetsGetDoc2htmlByIdSelector,
  mdbGetDenormContentUnitSelector,
  settingsGetUILangSelector
} from '../../../../../../redux/selectors';
import { getFile, getSummaryLanguages } from './helper';

const Summary = ({ id }) => {
  const { t } = useTranslation();

  const uiLang = useSelector(settingsGetUILangSelector);
  const contentLanguages = useSelector(settingsGetContentLanguagesSelector);
  const doc2htmlById     = useSelector(assetsGetDoc2htmlByIdSelector);
  const unit             = useSelector(state => mdbGetDenormContentUnitSelector(state, id));

  const dispatch = useDispatch();

  const summaryLanguages                        = getSummaryLanguages(unit);
  const defaultLanguage                         = selectSuitableLanguage(contentLanguages, summaryLanguages, unit.original_language);
  const [selectedLanguage, setSelectedLanguage] = useState(uiLang);

  const finalLanguage  = selectedLanguage || defaultLanguage;
  const file           = getFile(unit, finalLanguage);

  const handleLanguageChanged = language => {
    setSelectedLanguage(language);
  };

  useEffect(() => {
    if (file) {
      dispatch(assetsActions.doc2html(file.id));
    }
  }, [file, dispatch]);

  const { data }    = doc2htmlById[file?.id] || false;
  const description = unit.description
    ? (<div dangerouslySetInnerHTML={{ __html: unit.description }} />)
    : (data ? '' : t('materials.summary.no-summary'));

  return (
    <Segment basic>
      {description}
      {summaryLanguages.length <= 1 ? null :
        <MenuLanguageSelector
          languages={summaryLanguages}
          selected={finalLanguage}
          onLanguageChange={handleLanguageChanged}
          multiSelect={false}
        />
      }
      {
        data ? (
          <>
            {!!description && <Divider />}
            <div dangerouslySetInnerHTML={{ __html: data }}></div>
          </>
        ) : null

      }
    </Segment>
  );
};

export default Summary;

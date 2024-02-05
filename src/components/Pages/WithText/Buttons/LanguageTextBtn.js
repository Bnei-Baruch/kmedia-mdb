import React from 'react';
import { Dropdown, Button } from 'semantic-ui-react';
import { useSelector, useDispatch } from 'react-redux';

import { getOptions } from '../../../../helpers/language';
import { actions } from '../../../../redux/modules/textPage';
import {
  textPageGetSubjectSelector,
  textPageGetFileSelector,
  settingsGetUIDirSelector
} from '../../../../redux/selectors';
import TooltipForWeb from '../../../shared/TooltipForWeb';
import { useTranslation } from 'react-i18next';

const LanguageTextBtn = () => {
  const { t }    = useTranslation();
  const dispatch = useDispatch();

  const { language }  = useSelector(textPageGetFileSelector);
  const { languages } = useSelector(textPageGetSubjectSelector);
  const uiDir = useSelector(settingsGetUIDirSelector);

  const onChange = selected => {
    dispatch(actions.changeLanguage(selected));
  };

  const options = getOptions({ languages });
  return (
    <Dropdown
      trigger={
        <TooltipForWeb
          text={t('page-with-text.buttons.scan')}
          trigger={<Button icon={(<span className="material-symbols-outlined">Translate</span>)} />}
        />
      }
      value={language}
      onChange={(event, data) => onChange(data.value)}
      options={options}
      icon={null}
      className="text__language_popup"
    />
  );
};

export default LanguageTextBtn;

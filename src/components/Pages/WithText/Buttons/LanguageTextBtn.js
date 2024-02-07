import React from 'react';
import { Dropdown, Button } from 'semantic-ui-react';
import { useSelector, useDispatch } from 'react-redux';

import { getOptions } from '../../../../helpers/language';
import { actions } from '../../../../redux/modules/textPage';
import { textPageGetSubjectSelector, textPageGetFileSelector } from '../../../../redux/selectors';
import ToolbarBtnTooltip from './ToolbarBtnTooltip';

const LanguageTextBtn = () => {
  const dispatch = useDispatch();

  const { language }  = useSelector(textPageGetFileSelector);
  const { languages } = useSelector(textPageGetSubjectSelector);

  const onChange = selected => {
    dispatch(actions.changeLanguage(selected));
  };

  const options = getOptions({ languages });
  return (
    <Dropdown
      trigger={
        <ToolbarBtnTooltip
          textKey="languages"
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

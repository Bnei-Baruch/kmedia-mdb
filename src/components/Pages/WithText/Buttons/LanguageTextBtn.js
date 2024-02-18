import React, { useState } from 'react';
import { Dropdown } from 'semantic-ui-react';
import { useSelector, useDispatch } from 'react-redux';

import { getOptions } from '../../../../helpers/language';
import { actions } from '../../../../redux/modules/textPage';
import { textPageGetSubjectSelector, textPageGetFileSelector } from '../../../../redux/selectors';
import ToolbarBtnTooltip from './ToolbarBtnTooltip';

const LanguageTextBtn = () => {
  const dispatch = useDispatch();

  const { language }  = useSelector(textPageGetFileSelector);
  const { languages } = useSelector(textPageGetSubjectSelector);

  const [open, setOpen] = useState(false);

  const onChange   = (event, { value }) => dispatch(actions.changeLanguage(value));
  const toggleOpen = () => setOpen(!open);

  const options = getOptions({ languages });
  return (
    <Dropdown
      trigger={
        <ToolbarBtnTooltip
          textKey="languages"
          active={open}
          icon={(<span className="material-symbols-outlined">Translate</span>)}
        />
      }
      onClose={toggleOpen}
      onOpen={toggleOpen}
      value={language}
      onChange={onChange}
      options={options}
      icon={null}
      className="text__language_popup"
    />
  );
};

export default LanguageTextBtn;

import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { getOptions } from '../../../../helpers/language';
import { actions } from '../../../../redux/modules/textPage';
import { textPageGetSubjectSelector, textPageGetFileSelector } from '../../../../redux/selectors';
import ToolbarBtnTooltip from './ToolbarBtnTooltip';
import { isEmpty } from '../../../../helpers/utils';

const LanguageTextBtn = () => {
  const dispatch = useDispatch();

  const { language }  = useSelector(textPageGetFileSelector);
  const { languages } = useSelector(textPageGetSubjectSelector);

  const [open, setOpen] = useState(false);

  const onChange   = (event, { value }) => dispatch(actions.changeLanguage(value));
  const toggleOpen = () => setOpen(!open);

  const options = getOptions({ languages });
  const noLangs = isEmpty(options);
  return (
    <div className="text__language_popup relative">
      <ToolbarBtnTooltip
        textKey="languages"
        active={open}
        icon={(<span className="material-symbols-outlined">Translate</span>)}
        disabled={noLangs}
      />
      <select
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        disabled={noLangs}
        value={language}
        onChange={e => onChange(e, { value: e.target.value })}
        onFocus={toggleOpen}
        onBlur={toggleOpen}
      >
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.text}</option>
        ))}
      </select>
    </div>
  );
};

export default LanguageTextBtn;

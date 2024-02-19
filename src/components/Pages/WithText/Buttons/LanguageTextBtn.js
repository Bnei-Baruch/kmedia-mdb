import React, { useState } from 'react';
import { Dropdown } from 'semantic-ui-react';
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
    <Dropdown
      className="text__language_popup"
      icon={null}
      disabled={noLangs}
      trigger={
        <ToolbarBtnTooltip
          textKey="languages"
          active={open}
          icon={(<span className="material-symbols-outlined">Translate</span>)}
          disabled={noLangs}
        />
      }
      onClose={toggleOpen}
      onOpen={toggleOpen}
      value={language}
      onChange={onChange}
      options={options}
    />
  );
};

export default LanguageTextBtn;

import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Dropdown, Button } from 'semantic-ui-react';
import { getOptions } from '../../../../helpers/language';
import { actions } from '../../../../redux/modules/textPage';
import { textPageGetSubjectSelector, textPageGetFileSelector } from '../../../../redux/selectors';

const LanguageTextBtn = () => {
  const { language }  = useSelector(textPageGetFileSelector);
  const { languages } = useSelector(textPageGetSubjectSelector);

  const dispatch = useDispatch();
  const onChange = selected => {
    dispatch(actions.changeLanguage(selected));
  };

  const options = getOptions({ languages });
  return (
    <Dropdown
      trigger={
        <Button
          icon={(<span className="material-symbols-outlined">Translate</span>)}
        />
      }
      value={language}
      onChange={(event, data) => onChange(data.value)}
      options={options}
      icon={null}
    />
  );
};

export default LanguageTextBtn;

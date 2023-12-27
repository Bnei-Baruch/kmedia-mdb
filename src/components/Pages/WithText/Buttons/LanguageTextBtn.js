import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Dropdown, Button } from 'semantic-ui-react';
import { getOptions } from '../../../../helpers/language';
import { selectors as textPage, actions } from '../../../../redux/modules/textPage';

const LanguageTextBtn = () => {
  const { language }  = useSelector(state => textPage.getFile(state.textPage));
  const { languages } = useSelector(state => textPage.getSubject(state.textPage));

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

import { useState } from 'react';
import { withTranslation } from 'react-i18next';
import { Icon, Input } from 'semantic-ui-react';

const SearchInput = ({ onSearch, onClear, defVal = '', t }) => {
  const [value, setValue] = useState(defVal);

  const change = (e, data) => {
    onSearch(e, data);
    setValue(data.value);
  };

  const clear = () => {
    setValue('');
    onClear();
  };

  const keyDown = e => {
    if (e.keyCode === 27) { // Esc
      clear();
    }
  };

  return (
    <Input
      size="small"
      icon
      className="search-omnibox"
      placeholder={t('sources-library.filter')}
      onChange={change}
      onKeyDown={keyDown}
    >
      <input value={value} />
      <Icon name={value ? 'delete' : 'search'} link onClick={clear} />
    </Input>
  );
};

export default withTranslation()(SearchInput);

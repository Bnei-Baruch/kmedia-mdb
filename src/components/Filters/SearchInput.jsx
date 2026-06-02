import { useState } from 'react';
import { useTranslation } from 'react-i18next';

const SearchInput = ({ onSearch, onClear, defVal = '' }) => {
  const { t }             = useTranslation();
  const [value, setValue] = useState(defVal);

  const change = e => {
    const data = { value: e.target.value };
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
    <div className="search-omnibox relative inline-flex items-center">
      <input
        className="border border-gray-300 rounded px-3 py-1 small pr-8"
        placeholder={t('sources-library.filter')}
        value={value}
        onChange={change}
        onKeyDown={keyDown}
      />
      <span
        className="material-symbols-outlined absolute right-2 cursor-pointer text-gray-500 large"
        onClick={clear}
      >
        {value ? 'delete' : 'search'}
      </span>
    </div>
  );
};

export default SearchInput;

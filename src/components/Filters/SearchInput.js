import { useState } from 'react'
import { withNamespaces } from 'react-i18next';
import { Input, Icon } from 'semantic-ui-react';


const SearchInput = ({ onSearch, onClear, t }) => {
  const [value, setValue] = useState('');

  const change = (e, data) => {
    onSearch(e, data)
    setValue(data.value)
  }

  const clear = () => {
    setValue('')
    onClear()
  }

  const keyDown = e => {
    if (e.keyCode === 27) { // Esc
      clear();
    }
  }

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
      <Icon name={value ? 'delete' : 'search'} link onClick={clear}/>
    </Input>
  )
}

export default withNamespaces()(SearchInput);

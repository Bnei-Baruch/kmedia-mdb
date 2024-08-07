import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Input } from 'semantic-ui-react';
import { FN_FREE_TEXT } from '../../helpers/consts';
import { actions } from '../../redux/modules/filters';
import FilterHeader from './FilterHeader';
import { filtersGetFilterByNameSelector } from '../../redux/selectors';

let timer = null;

const CuName = ({ namespace }) => {
  const name = useSelector(state => filtersGetFilterByNameSelector(state, namespace, FN_FREE_TEXT))?.values[0] || '';

  const [temporaryName, setTemporaryName] = useState(name);

  const dispatch = useDispatch();
  useEffect(() => {
    timer && clearTimeout(timer);
    if (temporaryName) {
      timer = setTimeout(() => dispatch(actions.setFilterValue(namespace, FN_FREE_TEXT, temporaryName)), 500);
    }

    return () => clearTimeout(timer);

  }, [dispatch, temporaryName]);

  useEffect(() => {
    setTemporaryName(name);
  }, [name]);

  const handleChangeName = (e, { value }) => {
    setTemporaryName(value);
    !value && dispatch(actions.setFilterValue(namespace, FN_FREE_TEXT, null));
  };

  return (
    <FilterHeader
      filterName={FN_FREE_TEXT}
      children={
        <>
          <Input
            onChange={handleChangeName}
            className="search-input"
          >
            <input value={temporaryName}/>
          </Input>
        </>
      }
    />
  );
};

export default CuName;

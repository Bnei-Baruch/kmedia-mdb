import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
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

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, temporaryName]);

  useEffect(() => {
    setTemporaryName(name);
  }, [name]);

  const handleChangeName = e => {
    const { value } = e.target;
    setTemporaryName(value);
    !value && dispatch(actions.setFilterValue(namespace, FN_FREE_TEXT, null));
  };

  return (
    <FilterHeader
      filterName={FN_FREE_TEXT}
      children={
        <>
          <input
            onChange={handleChangeName}
            className="search-input"
            value={temporaryName}
          />
        </>
      }
    />
  );
};

export default CuName;

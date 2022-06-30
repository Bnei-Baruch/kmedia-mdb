import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Input } from 'semantic-ui-react';
import { FN_CU_NAME } from '../../helpers/consts';
import { actions, selectors as filters } from '../../redux/modules/filters';
import FilterHeader from './FilterHeader';

let timer = null;

const CuName = ({ namespace }) => {
  const name = useSelector(state => filters.getFilterByName(state.filters, namespace, FN_CU_NAME))?.values[0] || '';

  const [temporaryName, setTemporaryName] = useState(name);

  const dispatch = useDispatch();
  useEffect(() => {
    timer && clearTimeout(timer);
    if (temporaryName) {
      timer = setTimeout(() => dispatch(actions.setFilterValue(namespace, FN_CU_NAME, temporaryName)), 500);
    }

    return () => clearTimeout(timer);

  }, [dispatch, temporaryName]);

  const handleChangeName = (e, { value }) => {
    setTemporaryName(value);
    !value && dispatch(actions.setFilterValue(namespace, FN_CU_NAME, null));
  };

  return (
    <FilterHeader
      filterName={FN_CU_NAME}
      children={
        <>
          <Input
            onChange={handleChangeName}
            defaultValue={name}
            className="search-input"

          />
        </>
      }
    />
  );
};

export default CuName;

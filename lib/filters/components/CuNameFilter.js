import React, { useState } from 'react';
import { Input } from 'semantic-ui-react';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/router';

import { FN_FREE_TEXT } from '../../../src/helpers/consts';
import FilterHeader from './FilterHeader';
import { updateFiltersSearchParams } from '../helper';

let timer = null;

const CuName = () => {
  const searchParams = useSearchParams();
  const router       = useRouter();
  const name         = searchParams.get('name');

  const [temporaryName, setTemporaryName] = useState(name);

  if (name !== temporaryName) {
    timer && clearTimeout(timer);
    timer = setTimeout(() => {
      const query = updateFiltersSearchParams(temporaryName, true, FN_FREE_TEXT, searchParams, true);
      router.push({ query }, undefined, { scroll: false });
    }, 500);
  }

  const handleChangeName = (e, { value }) => {
    setTemporaryName(value);
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
            <input value={temporaryName} />
          </Input>
        </>
      }
    />
  );
};

export default CuName;

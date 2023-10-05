import React from 'react';
import { PAGE_NS_LESSONS, PAGE_NS_PROGRAMS, PAGE_NS_EVENTS } from '../../src/helpers/consts';
import FiltersLessons from '../../src/components/Sections/Lessons/Filters';
import FiltersEvents from '../../src/components/Sections/Events/Filters';
import FiltersPrograms from '../../src/components/Sections/Programs/Filters';
import { baseParamsByNamespace } from './helper';

export default function FilterByNamespace({ namespace }) {
  const _params = baseParamsByNamespace(namespace)
  if (namespace === PAGE_NS_LESSONS) {
    return <FiltersLessons namespace={namespace} baseParams={_params} />;
  }
  if (namespace === PAGE_NS_PROGRAMS) {
    return <FiltersPrograms namespace={namespace} baseParams={_params} />;
  }
  if (namespace === PAGE_NS_EVENTS) {
    return <FiltersEvents namespace={namespace} baseParams={_params} />;
  }
  return null;
}

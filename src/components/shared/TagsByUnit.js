import { Button } from 'semantic-ui-react';
import React from 'react';
import { useSelector } from 'react-redux';
import Link from 'next/link';

import { isEmpty } from '../../helpers/utils';
import { selectors as mdb } from '../../../lib/redux/slices/mdbSlice/mdbSlice';
import { selectors as tags } from '../../../lib/redux/slices/tagsSlice/tagsSlice';

const TagsByUnit = ({ id }) => {
  const unit       = useSelector(state => mdb.getDenormContentUnit(state.mdb, id));
  const lids       = useSelector(state => mdb.getLabelsByCU(state.mdb, id));
  const denorm     = useSelector(state => mdb.getDenormLabel(state.mdb));
  const labelTags  = lids?.map(denorm).flatMap(l => (l.tags || [])) || [];
  const getTagById = useSelector(state => tags.getTagById(state.tags));

  if (isEmpty(unit?.tags) && isEmpty(lids))
    return null;

  const names = [...(new Set([...(unit?.tags || []), ...labelTags]))].map(getTagById);

  return (
    <div className="unit-tags-bar">
      {
        names
          .map((tag, index) =>
            <Button key={`${tag.id}${index}`} basic compact size="small">
              <Link href={`/topics/${tag.id}`}>{tag.label}</Link>
            </Button>
          )
      }
    </div>
  );
};

export default TagsByUnit;

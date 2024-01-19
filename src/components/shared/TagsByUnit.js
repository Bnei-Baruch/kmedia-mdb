import { Button } from 'semantic-ui-react';
import Link from '../Language/MultiLanguageLink';
import React from 'react';
import { isEmpty } from '../../helpers/utils';
import { useSelector } from 'react-redux';
import { mdbGetDenormContentUnitSelector, mdbGetDenormLabelSelector, mdbGetLabelsByCUSelector, tagsGetTagByIdSelector } from '../../redux/selectors';

const TagsByUnit = ({ id }) => {
  const unit       = useSelector(state => mdbGetDenormContentUnitSelector(state, id));
  const lids       = useSelector(state => mdbGetLabelsByCUSelector(state, id));
  const denorm     = useSelector(mdbGetDenormLabelSelector);
  const labelTags  = lids?.map(denorm).flatMap(l => (l.tags || [])) || [];
  const getTagById = useSelector(tagsGetTagByIdSelector);

  if (isEmpty(unit?.tags) && isEmpty(lids))
    return null;

  const names = [...(new Set([...(unit?.tags || []), ...labelTags]))].map(getTagById);

  return (
    <div className="unit-tags-bar">
      {
        names
          .map((tag, index) =>
            <Button key={`${tag.id}${index}`} basic compact size="small">
              <Link to={`/topics/${tag.id}`}>{tag.label}</Link>
            </Button>
          )
      }
    </div>
  );
};

export default TagsByUnit;

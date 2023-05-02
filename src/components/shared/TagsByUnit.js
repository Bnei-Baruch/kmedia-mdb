import { Button } from 'semantic-ui-react';
import Link from '../Language/MultiLanguageLink';
import React from 'react';
import { isEmpty } from '../../helpers/utils';
import { useSelector } from 'react-redux';
import { selectors as mdb } from '../../redux/modules/mdb';
import { selectors as tags } from '../../redux/modules/tags';

const TagsByUnit = ({ id }) => {
  const unit       = useSelector(state => mdb.getDenormContentUnit(state.mdb, id));
  const lids       = useSelector(state => mdb.getLabelsByCU(state.mdb, id));
  const wip        = useSelector(state => mdb.getWip(state.mdb).labels);
  const denorm     = useSelector(state => mdb.getDenormLabel(state.mdb));
  const labelTags  = lids?.map(denorm).flatMap(l => (l.tags || [])) || [];
  const getTagById = useSelector(state => tags.getTagById(state.tags));

  if (isEmpty(unit?.tags) && isEmpty(lids) || wip)
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

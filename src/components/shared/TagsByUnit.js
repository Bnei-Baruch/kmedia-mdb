import React, { useRef, useState, useEffect } from 'react';
import { Button } from 'semantic-ui-react';
import Link from '../Language/MultiLanguageLink';
import { isEmpty } from '../../helpers/utils';
import { useSelector } from 'react-redux';
import {
  mdbGetDenormContentUnitSelector,
  mdbGetDenormLabelSelector,
  mdbGetLabelsByCUSelector,
  tagsGetTagByIdSelector
} from '../../redux/selectors';
import { useTranslation } from 'react-i18next';

const TagsByUnit = ({ id }) => {
  const { t }                     = useTranslation();
  const [showArrow, setShowArrow] = useState(0);

  const unit       = useSelector(state => mdbGetDenormContentUnitSelector(state, id));
  const lids       = useSelector(state => mdbGetLabelsByCUSelector(state, id));
  const denorm     = useSelector(mdbGetDenormLabelSelector);
  const labelTags  = lids?.map(denorm).flatMap(l => (l.tags || [])) || [];
  const getTagById = useSelector(tagsGetTagByIdSelector);

  const ref = useRef();

  useEffect(() => {
    const _cur = ref.current;
    if (_cur && (_cur.scrollWidth > _cur.clientWidth))
      setShowArrow(1);
  }, [ref.current]);

  if (isEmpty(unit?.tags) && isEmpty(lids))
    return null;

  const names        = [...(new Set([...(unit?.tags || []), ...labelTags]))].map(getTagById);
  const handleScroll = e => {
    const _t = e.target;
    if (Math.abs(_t.scrollLeft) < 10) {
      setShowArrow(1);
    } else if (_t.scrollWidth - 10 < _t.clientWidth + Math.abs(_t.scrollLeft)) {
      setShowArrow(2);
    }
  };

  const scrollLeft  = () => ref.current.scrollLeft += 300;
  const scrollRight = () => ref.current.scrollLeft -= 300;

  return (
    <div className="unit-tags-bar">
      <div className="unit-tags-title">{t('messages.unit-tags')}:</div>
      {
        showArrow > 0 && (
          <Button
            basic
            color="blue"
            className="clear_button"
            onClick={scrollLeft}
            icon={<span className="material-symbols-outlined">chevron_right</span>}
          />
        )
      }
      <div className="unit-tags-bar_tags" onScroll={handleScroll} ref={ref}>
        {
          names
            .map((tag, index) =>
              <Button key={`${tag.id}${index}`} className="unit-tag-item">
                <Link to={`/topics/${tag.id}`}>{tag.label}</Link>
              </Button>
            )
        }
      </div>
      {
        showArrow > 0 && (
          <Button
            basic
            color="blue"
            className="clear_button"
            onClick={scrollRight}
            icon={<span className="material-symbols-outlined">chevron_left</span>}
          />
        )
      }
    </div>
  );
};

export default TagsByUnit;

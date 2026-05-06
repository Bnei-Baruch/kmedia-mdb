import React, { useRef, useState, useCallback } from 'react';
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
  const { t } = useTranslation();
  const [showArrow, setShowArrow] = useState(0);

  const unit = useSelector(state => mdbGetDenormContentUnitSelector(state, id));
  const lids = useSelector(state => mdbGetLabelsByCUSelector(state, id));
  const denorm = useSelector(mdbGetDenormLabelSelector);
  const labelTags = lids?.map(denorm).flatMap(l => (l.tags || [])) || [];
  const getTagById = useSelector(tagsGetTagByIdSelector);

  const nodeRef = useRef(null);
  const ref = useCallback(node => {
    nodeRef.current = node;
    if (!node) return;
    if (node.scrollWidth > node.clientWidth)
      setShowArrow(1);
  }, []);

  if (isEmpty(unit?.tags) && isEmpty(lids))
    return null;

  const names = [...(new Set([...(unit?.tags || []), ...labelTags]))].map(getTagById);
  const handleScroll = e => {
    const _t = e.target;
    if (Math.abs(_t.scrollLeft) < 10) {
      setShowArrow(1);
    } else if (_t.scrollWidth - 10 < _t.clientWidth + Math.abs(_t.scrollLeft)) {
      setShowArrow(2);
    }
  };

  const scrollLeft = () => nodeRef.current.scrollLeft += 300;
  const scrollRight = () => nodeRef.current.scrollLeft -= 300;

  return (
    <div className="unit-tags-bar">
      <div className="unit-tags-title">{t('messages.unit-tags')}:</div>
      {
        showArrow > 0 && (
          <div onClick={scrollLeft}          >
            <span className="material-symbols-outlined  text-blue-600">chevron_right</span>
          </div>
        )
      }
      <div onScroll={handleScroll} ref={ref} className="unit-tags-bar_scroll">
        <div className="unit-tags-bar_tags">
          {
            names
              .filter(tag => !!tag)
              .map((tag, index) =>
                <div key={`${tag.id}${index}`} className="unit-tag-item">
                  <Link to={`/topics/${tag.id}`}>{tag.label}</Link>
                </div>
              )
          }
        </div>
      </div>
      {
        showArrow > 0 && (
          <div onClick={scrollRight}>
            <span className="material-symbols-outlined text-blue-600">chevron_left</span>
          </div>
        )
      }
    </div >
  );
};

export default TagsByUnit;

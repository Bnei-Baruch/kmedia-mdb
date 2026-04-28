import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Popover } from '@headlessui/react';
import { SectionLogo } from '../../../../helpers/images';
import { getLanguageDirection } from '../../../../helpers/i18n-utils';
import { makeTagLinks } from '../../WithPlayer/widgets/Info/Info';
import { useSelector } from 'react-redux';
import { textMarksPrefixByType } from '../scrollToSearch/helper';
import { highlightByPrefixAndId, clearHighlightByStyle } from '../helper';
import { tagsGetTagByIdSelector } from '../../../../redux/selectors';

const PopoverOpenEffect = ({ open, onOpen, onClose }) => {
  useEffect(() => {
    if (open) {
      onOpen?.();
    } else {
      onClose?.();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);
  return null;
};

const idPrefix  = textMarksPrefixByType['label'];
const LabelMark = ({ label, offset }) => {
  const { t } = useTranslation();

  const [top, setTop]       = useState(0);
  const [bottom, setBottom] = useState(0);

  const getTagById = useSelector(tagsGetTagByIdSelector);

  const { language, author, name, id, tags = [] } = label;
  useEffect(() => {
    const findTopBot = () => {
      let start = document.getElementById(`${idPrefix.start}${id}`);
      let end   = document.getElementById(`${idPrefix.end}${id}`);
      start     = start || end || null;
      end       = end || start || null;
      if (start) {
        const b = start.offsetTop !== end.offsetTop ? end.offsetTop : end.offsetTop + 20;
        setTop(Math.min(start.offsetTop, b));
        setBottom(Math.max(start.offsetTop, b));
      }
    };

    setTimeout(findTopBot, 0);
  }, [id]);

  if (!top || !bottom)
    return null;

  const dir = getLanguageDirection(language);

  const tagLinks = makeTagLinks(tags, getTagById);

  const handleOpen = () => highlightByPrefixAndId(idPrefix, id);

  return (
    <div className="label_mark" style={{ top, height: bottom - top + 20, left: `${offset.x * 5}px` }}>
      <Popover className="relative">
        {({ open }) => (
          <>
            <PopoverOpenEffect
              open={open}
              onOpen={handleOpen}
              onClose={() => clearHighlightByStyle()}
            />
            <Popover.Button
              className="clear_button"
              style={{ marginTop: `${offset.y * 20}px` }}
            >
              <SectionLogo name="topics" width="25" height="25" />
            </Popover.Button>
            <Popover.Panel
              className="label_mark_popup absolute left-full top-0 z-10 ml-2 rounded bg-gray-900 text-white p-3"
              dir={dir}
            >
              <div className="font-semibold">{name}</div>
              <div>
                {
                  t('personal.label.createdBy', { author })
                }
                <div>{tagLinks}</div>
              </div>
            </Popover.Panel>
          </>
        )}
      </Popover>
    </div>

  );
};

export default LabelMark;

import React from 'react';
import { useSelector } from 'react-redux';
import { Popover } from '@headlessui/react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { mdbGetDenormContentUnitSelector } from '../../../redux/selectors';
import { UNIT_LESSONS_TYPE } from '../../../helpers/consts';
import { strCmp, isEmpty } from '../../../helpers/utils';
import { canonicalLink } from '../../../helpers/links';
import Link from '../../Language/MultiLanguageLink';
import ToolbarBtnTooltip from '../../Pages/WithText/Buttons/ToolbarBtnTooltip';

const LessonsByLikutBtn = () => {
  const { id } = useParams();
  const { t }  = useTranslation();

  const unit = useSelector(state => mdbGetDenormContentUnitSelector(state, id));

  const lessons = Object.values(unit.source_units)
    .filter(u => UNIT_LESSONS_TYPE.includes(u.content_type))
    .sort((u1, u2) => strCmp(u2.film_date, u1.film_date));

  const trigger = (
    <ToolbarBtnTooltip
      textKey="lessons"
      disabled={isEmpty(lessons)}
      icon={<span className="material-symbols-outlined">subscriptions</span>}
    />
  );

  return (
    <Popover className="relative">
      <Popover.Button as="div">
        {trigger}
      </Popover.Button>
      <Popover.Panel className="absolute z-10 bg-white shadow-lg rounded border">
        {
          lessons.map(u =>
            <div key={u.id} className="px-4 py-2 hover:bg-gray-100">
              <Link to={canonicalLink(u)}>
                {t('values.date', { date: u.film_date })}
              </Link>
            </div>
          )
        }
      </Popover.Panel>
    </Popover>
  );
};

export default LessonsByLikutBtn;

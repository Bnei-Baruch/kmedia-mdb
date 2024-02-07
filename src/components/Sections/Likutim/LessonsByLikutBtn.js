import React from 'react';
import { useSelector } from 'react-redux';
import { Dropdown, Button } from 'semantic-ui-react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { mdbGetDenormContentUnitSelector } from '../../../redux/selectors';
import { UNIT_LESSONS_TYPE } from '../../../helpers/consts';
import { strCmp } from '../../../helpers/utils';
import { canonicalLink } from '../../../helpers/links';
import Link from '../../Language/MultiLanguageLink';
import ToolbarBtnTooltip from '../../Pages/WithText/Buttons/ToolbarBtnTooltip';

const LessonsByLikutBtn = () => {
  const { id } = useParams();
  const { t }  = useTranslation();

  const unit = useSelector(state => mdbGetDenormContentUnitSelector(state, id));

  // sort by film date desc
  const lessons = Object.values(unit.source_units)
    .filter(u => UNIT_LESSONS_TYPE.includes(u.content_type))
    .sort((u1, u2) => strCmp(u2.film_date, u1.film_date));

  const trigger = <ToolbarBtnTooltip
    trigger={<Button icon={<span className="material-symbols-outlined">subscriptions</span>} />}
    text={`${t(`search.intent-prefix.lessons-topic`)}  ${unit?.name}`}
  />;

  return (
    <Dropdown
      item
      trigger={trigger}
      icon={null}
    >
      <Dropdown.Menu>
        {
          lessons.map(u =>
            <Dropdown.Item key={u.id}>
              <Link to={canonicalLink(u)}>
                {t('values.date', { date: u.film_date })}
              </Link>
            </Dropdown.Item>
          )
        }
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default LessonsByLikutBtn;

import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import Filters from './Filters';
import VideoList from './VideoList';
import TextList from './TextList';
import FilterLabels from '../../FiltersAside/FilterLabels';
import HelmetsBasic from '../../shared/Helmets/Basic';
import { getBreadCrumbSection } from './helper';
import Link from '../../Language/MultiLanguageLink';
import { tagsGetPathByIDSelector, settingsGetLeftRightByDirSelector } from '../../../redux/selectors';

const RenderPage = () => {
  const { id } = useParams();
  const { t }  = useTranslation();

  const getPathByID = useSelector(tagsGetPathByIDSelector);
  const leftRight   = useSelector(settingsGetLeftRightByDirSelector);

  const tagPath = getPathByID(id);

  const breadCrumbSections = [{ id: '', label: t('nav.sidebar.topics') }, ...tagPath].map(getBreadCrumbSection);
  const breadCrumbIcon     = leftRight === 'right' ? 'chevron_right' : 'chevron_left';
  const baseParams         = useMemo(() => ({ tag: id }), [id]);

  return (
    <>
      <HelmetsBasic title={breadCrumbSections[breadCrumbSections.length - 1]?.content} />
      <div className="w-full px-4  topics">
        <nav>
          <ol className="flex flex-wrap items-center text-2xl">
            {breadCrumbSections.map((section, i) => (
              <React.Fragment key={section.key}>
                {i > 0 && (
                  <li className="mx-1">
                    <span className="material-symbols-outlined text-base">{breadCrumbIcon}</span>
                  </li>
                )}
                <li>
                  {section.active
                    ? <span className="font-bold">{section.content}</span>
                    : <Link to={section.to}>{section.content}</Link>
                  }
                </li>
              </React.Fragment>
            ))}
          </ol>
        </nav>
        <hr />
        <div className="grid grid-cols-[1fr_3fr] divide-x">
          <div className="filters-aside-wrapper px-1">
            <Filters
              namespace={`topics_${id}`}
              baseParams={baseParams}
            />
          </div>
          <div>
            <FilterLabels namespace={`topics_${id}`} />
            <div className="grid grid-cols-[5fr_3fr]">
              <div>
                <VideoList />
              </div>
              <div>
                <TextList />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default RenderPage;

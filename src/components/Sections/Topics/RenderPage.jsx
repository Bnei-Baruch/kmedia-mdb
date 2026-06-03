import { Fragment, useMemo } from 'react';
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

  const breadCrumbSections = [{ id: '', label: t('nav.sidebar.topics') }, ...tagPath].map(getBreadCrumbSection).filter(Boolean);
  const breadCrumbIcon     = leftRight === 'right' ? 'chevron_right' : 'chevron_left';
  const baseParams         = useMemo(() => ({ tag: id }), [id]);

  return <>
    <HelmetsBasic title={breadCrumbSections[breadCrumbSections.length - 1]?.content} />
    <div className="w-full topics">
      <nav aria-label="breadcrumb" className="flex flex-wrap items-center gap-1 text-xl font-bold p-4 border-b border-gray-200">
        {breadCrumbSections.map((section, i) => (
          <Fragment key={section.key}>
            {i > 0 && (
              <span className="material-symbols-outlined text-2xl text-gray-400 font-bold" aria-hidden="true">{breadCrumbIcon}</span>
            )}
            {section.active
              ? <span className="font-bold" aria-current="page">{section.content}</span>
              : <Link to={section.to}>{section.content}</Link>
            }
          </Fragment>
        ))}
      </nav>
      <div className="grid grid-cols-[1fr_3fr]">
        <div className="filters-aside-wrapper px-1 border-e">
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
  </>;
};

export default RenderPage;

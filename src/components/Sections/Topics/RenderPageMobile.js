import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Dialog } from '@headlessui/react';

import Filters from './Filters';
import VideoList from './VideoList';
import TextList from './TextList';
import FilterLabels from '../../FiltersAside/FilterLabels';
import HelmetsBasic from '../../shared/Helmets/Basic';
import { getBreadCrumbSection } from './helper';
import Link from '../../Language/MultiLanguageLink';
import {
  tagsGetPathByIDSelector,
  settingsGetUIDirSelector,
  settingsGetLeftRightByDirSelector
} from '../../../redux/selectors';

const RenderPageMobile = () => {
  const { id } = useParams();
  const { t }  = useTranslation();

  const [openFilters, setOpenFilters] = useState(false);

  const getPathByID = useSelector(tagsGetPathByIDSelector);
  const uiDir       = useSelector(settingsGetUIDirSelector);
  const leftRight   = useSelector(settingsGetLeftRightByDirSelector);

  const tagPath = getPathByID(id);

  const breadCrumbSections = [{ id: '', label: t('nav.sidebar.topics') }, ...tagPath].map(getBreadCrumbSection);
  const breadCrumbIcon     = leftRight === 'right' ? 'chevron_right' : 'chevron_left';
  const closeFilters       = () => setOpenFilters(false);

  return (
    <>
      <Dialog open={openFilters} onClose={closeFilters} className={`relative z-50 ${uiDir}`}>
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4" dir={uiDir}>
          <Dialog.Panel className="bg-white rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] flex flex-col">
            <button
              className="absolute top-2 right-2 p-1"
              onClick={closeFilters}
            >
              <span className="material-symbols-outlined">close</span>
            </button>
            <div className="filters-aside-wrapper overflow-y-auto flex-1 p-4">
              <Filters
                namespace={`topics_${id}`}
                baseParams={{ tag: id }}
              />
            </div>
            <div className="flex justify-end p-4 border-t">
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                onClick={closeFilters}
              >
                {t('buttons.close')}
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
      <HelmetsBasic title={breadCrumbSections[breadCrumbSections.length - 1]?.content} />
      <div className=" px-4  topics">
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
        <button
          className="float-right border border-gray-300 rounded px-3 py-1.5 bg-white hover:bg-gray-50"
          onClick={() => setOpenFilters(true)}
        >
          <span className="material-symbols-outlined">filter_list</span>
        </button>
        <hr />
        <FilterLabels namespace={`topics_${id}`} />
        <VideoList />
        <TextList />
      </div>
    </>
  );
};

export default RenderPageMobile;

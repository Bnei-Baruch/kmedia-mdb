import { clsx } from 'clsx';
import { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { SectionLogo } from '../../../helpers/images';
import Link from '../../Language/MultiLanguageLink';
import { DeviceInfoContext } from '../../../helpers/app-contexts';
import Section from './Section';

const SECTIONS = [
  { name: 'lessons', className: 'topIcon' },
  { name: 'programs', className: 'topIcon' },
  { name: 'topics', className: 'topIcon' },
  { name: 'sources', className: 'topIcon' },
  { name: 'events', className: '' },
  { name: 'likutim', className: '' },
  { name: 'publications', className: '' },
  { name: 'simple-mode', className: '' },
];

const ActiveSections = () => {
  const { t } = useTranslation();
  const { isMobile } = useContext(DeviceInfoContext);
  const iconSize = isMobile ? 50 : 100;

  return (
    <div className="homepage__website-sections homepage__section">
      <Section title={t('home.sections')}>
        <div className="homepage__iconsrow flex flex-wrap justify-center">
          <div className="activeSectionsIcons flex flex-wrap w-full">
            {SECTIONS.map(x => (
              <div
                key={x.name}
                className={clsx('w-1/4 flex items-stretch justify-center', !isMobile && x.className)}
              >
                <Link to={`/${x.name}`} className="flex flex-col items-center text-center">
                  <SectionLogo name={x.name} width={iconSize} height={iconSize} />
                  <div className="font-bold text-md lg:text-2xl">{t(`nav.sidebar.${x.name}`)}</div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </Section>
    </div>
  );
};

export default ActiveSections;

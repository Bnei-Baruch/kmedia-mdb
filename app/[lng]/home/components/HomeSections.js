import React from 'react';
import { Container, Grid, GridColumn, GridRow } from '/lib/SUI';

import Section from './Section';
//import Topic from './Topic';
import { useTranslation } from '../../../i18n';
import Topic from './Topic';

const _SECTIONS = [
  { name: 'lessons', className: 'topIcon' },
  { name: 'programs', className: 'topIcon' },
  { name: 'topics', className: 'topIcon' },
  { name: 'sources', className: 'topIcon' },
  { name: 'events', className: '' },
  { name: 'likutim', className: '' },
  { name: 'publications', className: '' },
  { name: 'simple-mode', className: '' }
];

const HomeSections = async ({ lng }) => {
  const { isMobileDevice } = false; //useContext(DeviceInfoContext) ;
  const { t }              = await useTranslation(lng);

  const iconSize = isMobileDevice ? 50 : 100;
  const fontSize = isMobileDevice ? 'small' : 'large';

  return (
    <div className="homepage__website-sections homepage__section">
      <Container className="padded horizontally">
        <Section title={t('home.sections')}>
          <Grid columns="equal" centered className="homepage__iconsrow">
            <GridRow className="activeSectionsIcons">
              {
                _SECTIONS.map((x) => (
                    <GridColumn
                      key={x.name}
                      width={4}
                      textAlign="center"
                      className={!isMobileDevice && x.className}
                    >
                      <Topic
                        title={t(`nav.sidebar.${x.name}`)}
                        src={x.name}
                        href={`/${x.name}`}
                        width={iconSize}
                        height={iconSize}
                        fontSize={fontSize}
                      />
                    </GridColumn>
                  )
                )
              }
            </GridRow>
          </Grid>
        </Section>
      </Container>
    </div>
  );
};

export default HomeSections;

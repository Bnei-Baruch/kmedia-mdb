import React, { useContext } from 'react';
import { Container, Grid } from 'semantic-ui-react';
import { useTranslation } from 'next-i18next';

import Section from './Section';
import Topic from './Topic';
import { DeviceInfoContext } from '../../../helpers/app-contexts';

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

const HomeSections = () => {
  const { isMobileDevice } = useContext(DeviceInfoContext);
  const { t }              = useTranslation();

  const iconSize = isMobileDevice ? 50 : 100;
  const fontSize = isMobileDevice ? 'small' : 'large';

  return (
    <div className="homepage__website-sections homepage__section">
      <Container className="padded horizontally">
        <Section title={t('home.sections')}>
          <Grid columns="equal" centered className="homepage__iconsrow">
            <Grid.Row className="activeSectionsIcons">
              {
                _SECTIONS.map((x) => (
                    <Grid.Column
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
                    </Grid.Column>
                  )
                )
              }
            </Grid.Row>
          </Grid>
        </Section>
      </Container>
    </div>
  );
};

export default HomeSections;

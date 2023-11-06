import React from 'react';
import { Container, Grid, GridColumn, GridRow } from '/lib/SUI';
//import LatestDailyLesson from './LatestDailyLesson';
import LatestLessonBanner from './LatestLessonBanner';

const HomeBanners = () => {
  return (
    <div className="homepage__featured homepage__section">
      <Container className="padded horizontally">
        <Grid centered>
          <GridRow>
            <GridColumn computer={6} tablet={7} mobile={16}>
              {/*
              <LatestDailyLesson />
*/}
            </GridColumn>
            <GridColumn computer={6} tablet={7} mobile={16}>
              <LatestLessonBanner />
            </GridColumn>
          </GridRow>
        </Grid>
      </Container>
    </div>
  );
};

export default HomeBanners;

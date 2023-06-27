import React from 'react';
import * as shapes from '../../shapes';
import { Container, Grid } from 'semantic-ui-react';
import LatestDailyLesson from './LatestDailyLesson';
import LatestLessonBanner from './LatestLessonBanner';

const HomeBanners = ({ latestLesson = null }) => {
  return (
    <div className="homepage__featured homepage__section">
      <Container className="padded horizontally">
        <Grid centered>
          <Grid.Row>
            {
              latestLesson
              && <Grid.Column computer={6} tablet={7} mobile={16}>
                <LatestDailyLesson collection={latestLesson} />
              </Grid.Column>
            }
            <Grid.Column computer={6} tablet={7} mobile={16}>
              <LatestLessonBanner />
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Container>
    </div>
  );
};

HomeBanners.propTypes = { latestLesson: shapes.LessonCollection };

export default HomeBanners;

import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Redirect from 'react-router/Redirect';

import * as shapes from '../shapes';
import Lessons from '../Sections/Lessons/MainPage';
import LessonUnit from '../Sections/Lessons/Unit/Container';
import LessonCollection from '../Sections/Lessons/Collection/MainPage';
import LastLessonCollection from '../Sections/Lessons/Collection/LastDaily';
import Programs from '../Sections/Programs/MainPage';
import ProgramChapter from '../Sections/Programs/Unit';
import ProgramCollection from '../Sections/Programs/Collection';
import Lectures from '../Sections/Lectures/List';
import LectureUnit from '../Sections/Lectures/Unit';
import LectureCollection from '../Sections/Lessons/Collection/UnitList';
import Publications from '../Sections/Publications/tabs/Articles/List';
import PublicationUnit from '../Sections/Publications/tabs/Articles/Unit';
import PublicationCollection from '../Sections/Publications/tabs/Articles/Collection';
import Events from '../Sections/Events/MainPage';
import EventUnit from '../Sections/Events/Unit';
import EventCollection from '../Sections/Events/Collection';
import LibraryHomepage from '../Sections/Library/Homepage';
import LibraryContainer from '../Sections/Library/LibraryContainer';
import SearchResults from '../Search/SearchResultsContainer';
import HomePage from '../Sections/Home/Container';
import Design from '../Design/Design';
import TopicsContainer from '../Sections/Topics/TopicContainer';

const NotFound       = () => <h1>Page not found</h1>;

const Routes = ({ match }) => {
  const { url } = match;

  // remove slash (/) from the end
  const urlPrefix = /\/$/.test(url) ? url.slice(0, -1) : match.url;

  return (
    <Switch>
      <Route exact path={`${urlPrefix}/`} component={HomePage} />
      <Route exact path={`${urlPrefix}/lessons`} component={Lessons} />
      <Route exact path={`${urlPrefix}/lessons/cu/:id`} component={LessonUnit} />
      <Route exact path={`${urlPrefix}/lessons/c/:id`} component={LessonCollection} />
      <Route exact path={`${urlPrefix}/lessons/latest`} component={LastLessonCollection} />
      <Route exact path={`${urlPrefix}/programs`} component={Programs} />
      <Route exact path={`${urlPrefix}/programs/cu/:id`} component={ProgramChapter} />
      <Route exact path={`${urlPrefix}/programs/c/:id`} component={ProgramCollection} />
      <Route exact path={`${urlPrefix}/events`} component={Events} />
      <Route exact path={`${urlPrefix}/events/:tab`} component={Events} />
      <Route exact path={`${urlPrefix}/events/cu/:id`} component={EventUnit} />
      <Route exact path={`${urlPrefix}/events/c/:id`} component={EventCollection} />
      <Route exact path={`${urlPrefix}/lectures`} component={Lectures} />
      <Route exact path={`${urlPrefix}/lectures/cu/:id`} component={LectureUnit} />
      <Route exact path={`${urlPrefix}/lectures/c/:id`} component={LectureCollection} />
      <Route exact path={`${urlPrefix}/publications`} component={Publications} />
      <Route exact path={`${urlPrefix}/publications/cu/:id`} component={PublicationUnit} />
      <Route exact path={`${urlPrefix}/publications/c/:id`} component={PublicationCollection} />
      <Route exact path={`${urlPrefix}/sources`} component={LibraryHomepage} />
      <Route exact path={`${urlPrefix}/sources/:id`} component={LibraryContainer} />
      <Route exact path={`${urlPrefix}/topics`} component={TopicsContainer} />
      <Route exact path={`${urlPrefix}/search`} component={SearchResults} />
      <Route exact path={`${urlPrefix}/design`} component={Design} />
      <Route exact path={`${urlPrefix}/design2`} component={Lessons} />

      {/* Old routes - redirect for now */}
      <Redirect from={`${urlPrefix}/lessons/part/:id`} to={`${urlPrefix}/lessons/cu/:id`} />
      <Redirect from={`${urlPrefix}/lessons/full/:id`} to={`${urlPrefix}/lessons/c/:id`} />
      <Redirect from={`${urlPrefix}/programs/chapter/:id`} to={`${urlPrefix}/programs/cu/:id`} />
      <Redirect from={`${urlPrefix}/programs/full/:id`} to={`${urlPrefix}/programs/c/:id`} />
      <Redirect from={`${urlPrefix}/events/item/:id`} to={`${urlPrefix}/events/cu/:id`} />
      <Redirect from={`${urlPrefix}/events/full/:id`} to={`${urlPrefix}/events/c/:id`} />
      {/* Old versions "saved on screen" in Android still point to /index.html */}
      <Redirect from={`${urlPrefix}/index.html`} to={`${urlPrefix}/`} />

      <Route path="*" component={NotFound} />
    </Switch>
  );
};

Routes.propTypes = {
  match: shapes.RouterMatch.isRequired,
};

export default Routes;

import React from 'react';
import { Route, Switch } from 'react-router-dom';

import * as shapes from '../shapes';
import Lessons from '../Lessons/List';
import LessonUnit from '../Lessons/Unit';
import FullLesson from '../Lessons/Full/FullLessonContainer';
import Programs from '../Programs/List';
import ProgramChapter from '../Programs/Unit';
import ProgramCollection from '../Programs/Collection';
import Lectures from '../Lectures/List';
import LectureUnit from '../Lectures/Unit';
import LectureCollection from '../Lectures/Collection';
import Publications from '../Publications/List';
import PublicationUnit from '../Publications/Unit';
import PublicationCollection from '../Publications/Collection';
import Events from '../Events/MainPage';
import EventItem from '../Events/Unit';
import FullEvent from '../Events/Full/FullEventContainer';
import LibraryHomepage from '../Library/Homepage';
import LibraryContainer from '../Library/LibraryContainer';
import SearchResults from '../Search/SearchResultsContainer';
import Design from '../Design/Design';

import Redirect from './Redirect';

const NotImplemented = () => <h1>Not Implemented Yet</h1>;
const NotFound       = () => <h1>Page not found</h1>;

const Routes = ({ match }) => {
  const { url } = match;

  // remove slash (/) from the end
  const urlPrefix = /\/$/.test(url) ? url.slice(0, -1) : match.url;

  return (
    <Switch>
      <Route exact path={`${urlPrefix}/`} component={Lessons} />
      <Route exact path={`${urlPrefix}/lessons`} component={Lessons} />
      <Route exact path={`${urlPrefix}/lessons/cu/:id`} component={LessonUnit} />
      <Route exact path={`${urlPrefix}/lessons/c/:id`} component={FullLesson} />
      <Route exact path={`${urlPrefix}/programs`} component={Programs} />
      <Route exact path={`${urlPrefix}/programs/cu/:id`} component={ProgramChapter} />
      <Route exact path={`${urlPrefix}/programs/c/:id`} component={ProgramCollection} />
      <Route exact path={`${urlPrefix}/events`} component={Events} />
      <Route exact path={`${urlPrefix}/events/:tab`} component={Events} />
      <Route exact path={`${urlPrefix}/events/cu/:id`} component={EventItem} />
      <Route exact path={`${urlPrefix}/events/c/:id`} component={FullEvent} />
      <Route exact path={`${urlPrefix}/lectures`} component={Lectures} />
      <Route exact path={`${urlPrefix}/lectures/cu/:id`} component={LectureUnit} />
      <Route exact path={`${urlPrefix}/lectures/c/:id`} component={LectureCollection} />
      <Route exact path={`${urlPrefix}/publications`} component={Publications} />
      <Route exact path={`${urlPrefix}/publications/cu/:id`} component={PublicationUnit} />
      <Route exact path={`${urlPrefix}/publications/c/:id`} component={PublicationCollection} />
      <Route exact path={`${urlPrefix}/sources`} component={LibraryHomepage} />
      <Route exact path={`${urlPrefix}/sources/:id`} component={LibraryContainer} />
      <Route exact path={`${urlPrefix}/books`} component={NotImplemented} />
      <Route exact path={`${urlPrefix}/topics`} component={NotImplemented} />
      <Route exact path={`${urlPrefix}/photos`} component={NotImplemented} />
      <Route exact path={`${urlPrefix}/search`} component={SearchResults} />
      <Route exact path={`${urlPrefix}/design`} component={Design} />
      <Route exact path={`${urlPrefix}/design2`} component={Lessons} />

      /* Old routes - redirect for now */
      <Redirect from={`${urlPrefix}/lessons/part/:id`} to={`${urlPrefix}/lessons/cu/:id`} />
      <Redirect from={`${urlPrefix}/lessons/full/:id`} to={`${urlPrefix}/lessons/c/:id`} />
      <Redirect from={`${urlPrefix}/programs/chapter/:id`} to={`${urlPrefix}/programs/cu/:id`} />
      <Redirect from={`${urlPrefix}/programs/full/:id`} to={`${urlPrefix}/programs/c/:id`} />
      <Redirect from={`${urlPrefix}/events/item/:id`} to={`${urlPrefix}/events/cu/:id`} />
      <Redirect from={`${urlPrefix}/events/full/:id`} to={`${urlPrefix}/events/c/:id`} />

      <Route component={NotFound} />
    </Switch>
  );
};

Routes.propTypes = {
  match: shapes.RouterMatch.isRequired,
};

export default Routes;

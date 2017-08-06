import React from 'react';
import { Route, Switch } from 'react-router-dom';

import Lessons from '../Lessons/List/LessonsContainer';
import LessonPart from '../Lessons/Part/LessonPartContainer';
import FullLesson from '../Lessons/Full/FullLessonContainer';
import Programs from '../Programs/List/ProgramsContainer';
import ProgramChapter from '../Programs/Chapter/ProgramChapterContainer';
import FullProgram from '../Programs/Full/FullProgramContainer';
import Design from '../Design/Design';

const NotImplemented = () => <h1>Not Implemented Yet</h1>;
const NotFound       = () => <h1>Page not found</h1>;

const Routes = () => (
  <Switch>
    <Route exact path="/" component={Lessons} />
    <Route exact path="/lessons" component={Lessons} />
    <Route exact path="/lessons/part/:id" component={LessonPart} />
    <Route exact path="/lessons/full/:id" component={FullLesson} />
    <Route exact path="/programs" component={Programs} />
    <Route exact path="/programs/chapter/:id" component={ProgramChapter} />
    <Route exact path="/programs/full/:id" component={FullProgram} />
    <Route exact path="/programs" component={Programs} />
    <Route exact path="/lectures" component={NotImplemented} />
    <Route exact path="/sources" component={NotImplemented} />
    <Route exact path="/events" component={NotImplemented} />
    <Route exact path="/books" component={NotImplemented} />
    <Route exact path="/topics" component={NotImplemented} />
    <Route exact path="/publications" component={NotImplemented} />
    <Route exact path="/photos" component={NotImplemented} />
    <Route exact path="/design" component={Design} />
    <Route exact path="/design2" component={Lessons} />
    <Route component={NotFound} />
  </Switch>
);

export default Routes;

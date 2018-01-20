'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactRouterDom = require('react-router-dom');

var _LessonsContainer = require('../Lessons/List/LessonsContainer');

var _LessonsContainer2 = _interopRequireDefault(_LessonsContainer);

var _LessonPartContainer = require('../Lessons/Part/LessonPartContainer');

var _LessonPartContainer2 = _interopRequireDefault(_LessonPartContainer);

var _FullLessonContainer = require('../Lessons/Full/FullLessonContainer');

var _FullLessonContainer2 = _interopRequireDefault(_FullLessonContainer);

var _ProgramsContainer = require('../Programs/List/ProgramsContainer');

var _ProgramsContainer2 = _interopRequireDefault(_ProgramsContainer);

var _ProgramChapterContainer = require('../Programs/Chapter/ProgramChapterContainer');

var _ProgramChapterContainer2 = _interopRequireDefault(_ProgramChapterContainer);

var _FullProgramContainer = require('../Programs/Full/FullProgramContainer');

var _FullProgramContainer2 = _interopRequireDefault(_FullProgramContainer);

var _EventsContainer = require('../Events/List/EventsContainer');

var _EventsContainer2 = _interopRequireDefault(_EventsContainer);

var _EventItemContainer = require('../Events/Item/EventItemContainer');

var _EventItemContainer2 = _interopRequireDefault(_EventItemContainer);

var _FullEventContainer = require('../Events/Full/FullEventContainer');

var _FullEventContainer2 = _interopRequireDefault(_FullEventContainer);

var _SearchResultsContainer = require('../Search/SearchResultsContainer');

var _SearchResultsContainer2 = _interopRequireDefault(_SearchResultsContainer);

var _Design = require('../Design/Design');

var _Design2 = _interopRequireDefault(_Design);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var NotImplemented = function NotImplemented() {
  return _react2.default.createElement(
    'h1',
    null,
    'Not Implemented Yet'
  );
};
var NotFound = function NotFound() {
  return _react2.default.createElement(
    'h1',
    null,
    'Page not found'
  );
};

var Routes = function Routes(_ref) {
  var match = _ref.match;
  var url = match.url;

  // remove slash (/) from the end

  var urlPrefix = /\/$/.test(url) ? url.slice(0, -1) : match.url;

  console.log(urlPrefix);
  console.log(url);

  return _react2.default.createElement(
    _reactRouterDom.Switch,
    null,
    _react2.default.createElement(_reactRouterDom.Route, { exact: true, path: urlPrefix + '/', component: _LessonsContainer2.default }),
    _react2.default.createElement(_reactRouterDom.Route, { exact: true, path: urlPrefix + '/lessons', component: _LessonsContainer2.default }),
    _react2.default.createElement(_reactRouterDom.Route, { exact: true, path: urlPrefix + '/lessons/part/:id', component: _LessonPartContainer2.default }),
    _react2.default.createElement(_reactRouterDom.Route, { exact: true, path: urlPrefix + '/lessons/full/:id', component: _FullLessonContainer2.default }),
    _react2.default.createElement(_reactRouterDom.Route, { exact: true, path: urlPrefix + '/programs', component: _ProgramsContainer2.default }),
    _react2.default.createElement(_reactRouterDom.Route, { exact: true, path: urlPrefix + '/programs/chapter/:id', component: _ProgramChapterContainer2.default }),
    _react2.default.createElement(_reactRouterDom.Route, { exact: true, path: urlPrefix + '/programs/full/:id', component: _FullProgramContainer2.default }),
    _react2.default.createElement(_reactRouterDom.Route, { exact: true, path: urlPrefix + '/events', component: _EventsContainer2.default }),
    _react2.default.createElement(_reactRouterDom.Route, { exact: true, path: urlPrefix + '/events/item/:id', component: _EventItemContainer2.default }),
    _react2.default.createElement(_reactRouterDom.Route, { exact: true, path: urlPrefix + '/events/full/:id', component: _FullEventContainer2.default }),
    _react2.default.createElement(_reactRouterDom.Route, { exact: true, path: urlPrefix + '/lectures', component: NotImplemented }),
    _react2.default.createElement(_reactRouterDom.Route, { exact: true, path: urlPrefix + '/sources', component: NotImplemented }),
    _react2.default.createElement(_reactRouterDom.Route, { exact: true, path: urlPrefix + '/events', component: NotImplemented }),
    _react2.default.createElement(_reactRouterDom.Route, { exact: true, path: urlPrefix + '/books', component: NotImplemented }),
    _react2.default.createElement(_reactRouterDom.Route, { exact: true, path: urlPrefix + '/topics', component: NotImplemented }),
    _react2.default.createElement(_reactRouterDom.Route, { exact: true, path: urlPrefix + '/publications', component: NotImplemented }),
    _react2.default.createElement(_reactRouterDom.Route, { exact: true, path: urlPrefix + '/photos', component: NotImplemented }),
    _react2.default.createElement(_reactRouterDom.Route, { exact: true, path: urlPrefix + '/search', component: _SearchResultsContainer2.default }),
    _react2.default.createElement(_reactRouterDom.Route, { exact: true, path: urlPrefix + '/design', component: _Design2.default }),
    _react2.default.createElement(_reactRouterDom.Route, { exact: true, path: urlPrefix + '/design2', component: _LessonsContainer2.default }),
    _react2.default.createElement(_reactRouterDom.Route, { component: NotFound })
  );
};

exports.default = Routes;
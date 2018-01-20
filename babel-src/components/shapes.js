'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ErrorsMap = exports.Error = exports.WipMap = exports.WIP = exports.filterPropShape = exports.Topics = exports.Source = exports.EventItem = exports.EventCollection = exports.ProgramChapter = exports.ProgramCollection = exports.LessonPart = exports.LessonCollection = exports.ContentUnit = exports.GenericCollection = exports.MDBFile = exports.HistoryLocation = exports.RouterMatch = undefined;

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var RouterMatch = exports.RouterMatch = _propTypes2.default.shape({
  path: _propTypes2.default.string.isRequired,
  url: _propTypes2.default.string.isRequired,
  params: _propTypes2.default.object,
  isExact: _propTypes2.default.bool
});

var HistoryLocation = exports.HistoryLocation = _propTypes2.default.shape({
  pathname: _propTypes2.default.string,
  search: _propTypes2.default.string,
  hash: _propTypes2.default.string,
  key: _propTypes2.default.string,
  state: _propTypes2.default.object
});

var MDBFile = exports.MDBFile = _propTypes2.default.shape({
  id: _propTypes2.default.string.isRequired,
  name: _propTypes2.default.string.isRequired,
  type: _propTypes2.default.string,
  subtype: _propTypes2.default.string,
  mimetype: _propTypes2.default.string,
  language: _propTypes2.default.string,
  size: _propTypes2.default.number,
  duration: _propTypes2.default.number
});

var MDBBaseContentUnit = {
  id: _propTypes2.default.string.isRequired,
  content_type: _propTypes2.default.string,
  name: _propTypes2.default.string,
  description: _propTypes2.default.string,
  files: _propTypes2.default.arrayOf(MDBFile),
  cIDs: _propTypes2.default.objectOf(_propTypes2.default.string), // ccu.name => Collection ID
  sduIDs: _propTypes2.default.objectOf(_propTypes2.default.string), // sdu.name => Source Derived Units ID  (i.e parents)
  dduIDs: _propTypes2.default.objectOf(_propTypes2.default.string), // ddu.name => Derived Derived Units IDs (i.e children)
  tags: _propTypes2.default.arrayOf(_propTypes2.default.string),
  sources: _propTypes2.default.arrayOf(_propTypes2.default.string)
};

var MDBBaseCollection = {
  id: _propTypes2.default.string.isRequired,
  content_type: _propTypes2.default.string,
  name: _propTypes2.default.string,
  description: _propTypes2.default.string,
  cuIDs: _propTypes2.default.arrayOf(_propTypes2.default.string), // Content Units IDs
  ccuNames: _propTypes2.default.objectOf(_propTypes2.default.string) // cuID -> ccu.name
};

var MDBDenormalizedContentUnit = Object.assign({}, MDBBaseContentUnit, {
  collections: _propTypes2.default.objectOf(_propTypes2.default.shape(MDBBaseCollection)), // ccu.name -> collection
  source_units: _propTypes2.default.objectOf(_propTypes2.default.shape(MDBBaseContentUnit)), // sdu.name => Source Derived Unit
  derived_units: _propTypes2.default.objectOf(_propTypes2.default.shape(MDBBaseContentUnit)) // ddu.name => Derived Derived Unit
});

var MDBDenormalizedCollection = Object.assign({}, MDBBaseCollection, {
  content_units: _propTypes2.default.arrayOf(_propTypes2.default.shape(MDBBaseContentUnit))
});

var GenericCollection = exports.GenericCollection = _propTypes2.default.shape(MDBDenormalizedCollection);

var ContentUnit = exports.ContentUnit = _propTypes2.default.shape(MDBBaseContentUnit);

var LessonCollection = exports.LessonCollection = _propTypes2.default.shape(Object.assign({}, MDBDenormalizedCollection, {
  film_date: _propTypes2.default.string.isRequired
}));

var LessonPart = exports.LessonPart = _propTypes2.default.shape(Object.assign({}, MDBDenormalizedContentUnit, {
  film_date: _propTypes2.default.string.isRequired
}));

var ProgramCollection = exports.ProgramCollection = _propTypes2.default.shape(Object.assign({}, MDBDenormalizedCollection, {
  genres: _propTypes2.default.arrayOf(_propTypes2.default.string),
  default_language: _propTypes2.default.string
}));

var ProgramChapter = exports.ProgramChapter = _propTypes2.default.shape(Object.assign({}, MDBDenormalizedContentUnit, {
  film_date: _propTypes2.default.string.isRequired
}));

var EventCollection = exports.EventCollection = _propTypes2.default.shape(Object.assign({}, MDBDenormalizedCollection, {
  start_date: _propTypes2.default.string.isRequired,
  end_date: _propTypes2.default.string.isRequired,
  city: _propTypes2.default.string,
  country: _propTypes2.default.string,
  full_address: _propTypes2.default.string
}));

var EventItem = exports.EventItem = _propTypes2.default.shape(Object.assign({}, MDBDenormalizedContentUnit, {
  film_date: _propTypes2.default.string.isRequired
}));

var Source = exports.Source = _propTypes2.default.shape({
  id: _propTypes2.default.string.isRequired,
  parent_id: _propTypes2.default.string,
  type: _propTypes2.default.string.isRequired,
  name: _propTypes2.default.string,
  description: _propTypes2.default.string
});

var Topics = exports.Topics = _propTypes2.default.arrayOf(_propTypes2.default.shape({
  id: _propTypes2.default.string.isRequired,
  label: _propTypes2.default.string.isRequired
}));

var filterPropShape = exports.filterPropShape = _propTypes2.default.shape({
  name: _propTypes2.default.string.isRequired,
  component: _propTypes2.default.any.isRequired
});

var WIP = exports.WIP = _propTypes2.default.bool;
var WipMap = exports.WipMap = _propTypes2.default.objectOf(_propTypes2.default.oneOfType([WIP, _propTypes2.default.objectOf(WIP)]));

var Error = exports.Error = _propTypes2.default.object;
var ErrorsMap = exports.ErrorsMap = _propTypes2.default.objectOf(_propTypes2.default.oneOfType([Error, _propTypes2.default.objectOf(Error)]));
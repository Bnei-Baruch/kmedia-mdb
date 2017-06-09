import PropTypes from 'prop-types';

export const RouterMatch = PropTypes.shape({
  path: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
  params: PropTypes.object,
  isExact: PropTypes.bool,
});

export const HistoryLocation = PropTypes.shape({
  pathname: PropTypes.string,
  search: PropTypes.string,
  hash: PropTypes.string,
  key: PropTypes.string,
  state: PropTypes.object,
});

export const MDBFile = PropTypes.shape({
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  type: PropTypes.string,
  subtype: PropTypes.string,
  mime_type: PropTypes.string,
  language: PropTypes.string,
});

const MDBBaseContentUnit = {
  id: PropTypes.string.isRequired,
  content_type: PropTypes.string.isRequired,
  name: PropTypes.string,
  description: PropTypes.string,
  files: PropTypes.arrayOf(MDBFile),
};

const MDBBaseCollection = {
  id: PropTypes.string.isRequired,
  content_type: PropTypes.string.isRequired,
  name: PropTypes.string,
  description: PropTypes.string,
};

export const LessonCollection = PropTypes.shape({
  ...MDBBaseCollection,
  film_date: PropTypes.string.isRequired,
  content_units: PropTypes.arrayOf(PropTypes.shape(MDBBaseContentUnit)),
});

export const LessonPart = PropTypes.shape({
  ...MDBBaseContentUnit,
  film_date: PropTypes.string.isRequired,
  collections: PropTypes.objectOf(PropTypes.shape(MDBBaseCollection)),
});

export const Topics = PropTypes.objectOf(PropTypes.shape({
  uid: PropTypes.string.isRequired,
  pattern: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
}));

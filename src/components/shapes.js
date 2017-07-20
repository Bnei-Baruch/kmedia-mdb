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
  content_type: PropTypes.string,
  name: PropTypes.string,
  description: PropTypes.string,
  files: PropTypes.arrayOf(MDBFile),
};

export const ContentUnit = PropTypes.shape(MDBBaseContentUnit);

const MDBBaseCollection = {
  id: PropTypes.string.isRequired,
  content_type: PropTypes.string,
  name: PropTypes.string,
  description: PropTypes.string,
  cuIDs: PropTypes.arrayOf(PropTypes.string),
  ccuNames: PropTypes.objectOf(PropTypes.string),  // cuID -> ccuName
  content_units: PropTypes.arrayOf(ContentUnit),
};

export const Collection = PropTypes.shape(MDBBaseCollection);

export const LessonCollection = PropTypes.shape({
  ...MDBBaseCollection,
  film_date: PropTypes.string.isRequired,
});

export const LessonPart = PropTypes.shape({
  ...MDBBaseContentUnit,
  film_date: PropTypes.string.isRequired,
  collections: PropTypes.objectOf(Collection),
  tags: PropTypes.arrayOf(PropTypes.string),
  sources: PropTypes.arrayOf(PropTypes.string),
  source_units: PropTypes.objectOf(ContentUnit),
  derived_units: PropTypes.objectOf(ContentUnit),
});

export const Topics = PropTypes.arrayOf(PropTypes.shape({
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
}));

export const filterPropShape = PropTypes.shape({
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  component: PropTypes.any.isRequired
});

export const WIP    = PropTypes.bool;
export const WipMap = PropTypes.objectOf(PropTypes.oneOfType([WIP, PropTypes.objectOf(WIP)]));

export const Error     = PropTypes.object;
export const ErrorsMap = PropTypes.objectOf(PropTypes.oneOfType([Error, PropTypes.objectOf(Error)]));

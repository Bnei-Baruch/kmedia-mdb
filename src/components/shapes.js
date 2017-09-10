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
  mimetype: PropTypes.string,
  language: PropTypes.string,
  size: PropTypes.number,
  duration: PropTypes.number,
});

const MDBBaseContentUnit = {
  id: PropTypes.string.isRequired,
  content_type: PropTypes.string,
  name: PropTypes.string,
  description: PropTypes.string,
  files: PropTypes.arrayOf(MDBFile),
  cIDs: PropTypes.objectOf(PropTypes.string),    // ccu.name => Collection ID
  sduIDs: PropTypes.objectOf(PropTypes.string),  // sdu.name => Source Derived Units ID  (i.e parents)
  dduIDs: PropTypes.objectOf(PropTypes.string),  // ddu.name => Derived Derived Units IDs (i.e children)
  tags: PropTypes.arrayOf(PropTypes.string),
  sources: PropTypes.arrayOf(PropTypes.string),
};

const MDBBaseCollection = {
  id: PropTypes.string.isRequired,
  content_type: PropTypes.string,
  name: PropTypes.string,
  description: PropTypes.string,
  cuIDs: PropTypes.arrayOf(PropTypes.string),      // Content Units IDs
  ccuNames: PropTypes.objectOf(PropTypes.string),  // cuID -> ccu.name
};

const MDBDenormalizedContentUnit = {
  ...MDBBaseContentUnit,
  collections: PropTypes.objectOf(PropTypes.shape(MDBBaseCollection)),     // ccu.name -> collection
  source_units: PropTypes.objectOf(PropTypes.shape(MDBBaseContentUnit)),   // sdu.name => Source Derived Unit
  derived_units: PropTypes.objectOf(PropTypes.shape(MDBBaseContentUnit)),  // ddu.name => Derived Derived Unit
};

const MDBDenormalizedCollection = {
  ...MDBBaseCollection,
  content_units: PropTypes.arrayOf(PropTypes.shape(MDBBaseContentUnit)),
};

export const GenericCollection = PropTypes.shape(MDBDenormalizedCollection);

export const ContentUnit = PropTypes.shape(MDBBaseContentUnit);

export const LessonCollection = PropTypes.shape({
  ...MDBDenormalizedCollection,
  film_date: PropTypes.string.isRequired,
});

export const LessonPart = PropTypes.shape({
  ...MDBDenormalizedContentUnit,
  film_date: PropTypes.string.isRequired,
});

export const ProgramCollection = PropTypes.shape({
  ...MDBDenormalizedCollection,
});

export const ProgramChapter = PropTypes.shape({
  ...MDBDenormalizedContentUnit,
  film_date: PropTypes.string.isRequired,
});

export const EventCollection = PropTypes.shape({
  ...MDBDenormalizedCollection,
  start_date: PropTypes.string.isRequired,
  end_date: PropTypes.string.isRequired,
  city: PropTypes.string,
  country: PropTypes.string,
  full_address: PropTypes.string,
});

export const EventItem = PropTypes.shape({
  ...MDBDenormalizedContentUnit,
  film_date: PropTypes.string.isRequired,
});

export const Topics = PropTypes.arrayOf(PropTypes.shape({
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
}));

export const filterPropShape = PropTypes.shape({
  name: PropTypes.string.isRequired,
  component: PropTypes.any.isRequired
});

export const WIP    = PropTypes.bool;
export const WipMap = PropTypes.objectOf(PropTypes.oneOfType([WIP, PropTypes.objectOf(WIP)]));

export const Error     = PropTypes.object;
export const ErrorsMap = PropTypes.objectOf(PropTypes.oneOfType([Error, PropTypes.objectOf(Error)]));

import React, { Component } from 'react';
import PropTypes from 'prop-types';
// import zlFetch from 'zl-fetch';
import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker,
} from 'react-google-maps';

const EventMapInner = withScriptjs(withGoogleMap(props => (
  <GoogleMap
    defaultZoom={10}
    defaultCenter={{ lat: props.location.lat, lng: props.location.lng }}
  >
    <Marker
      position={{ lat: props.location.lat, lng: props.location.lng }}
    />
  </GoogleMap>
)));

class EventMap extends Component {
  static propTypes = {
    language: PropTypes.string.isRequired,
    address: PropTypes.string,
    country: PropTypes.string,
    city: PropTypes.string,
  };

  static defaultProps = {
    address: '',
    country: '',
    city: '',
  };

  constructor(props) {
    super(props);
    this.state = {
      loaded: false,
      location: null,
    };
  }

  componentDidMount() {
    this.fetchLocation(this.props.address).then((location) => {
      if (!location) {
        this.fetchLocation(`${this.props.country}, ${this.props.city}`).then((altLocation) => {
          this.setState({ loaded: true, location: altLocation });
        });
      } else {
        this.setState({ loaded: true, location });
      }
    });
  }

  // Fix: zlFetch does not work well here.
  fetchLocation = address =>
      fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${address}`).then(data =>
          data.json().then(json =>
              (json.results && json.results.length ? json.results[0].geometry.location : null)));

  render() {
    let { language } = this.props;
    const { loaded, location } = this.state;
    if (loaded && location) {
      if (language === 'he') {
        language = 'iw';
      }
      console.log(language);
      return (
        <EventMapInner
          googleMapURL={`https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places&language=${language}`}
          loadingElement={<div style={{ height: '100%' }} />}
          containerElement={<div style={{ height: '400px' }} />}
          mapElement={<div style={{ height: '100%' }} />}
          location={location}
          {...this.props}
        />
      );
    }
    return (<div style={{ height: '100%' }} />);
  }
}

export default EventMap;


import React, { Component } from 'react';
import PropTypes from 'prop-types';
// import zlFetch from 'zl-fetch';
import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker,
} from "react-google-maps";

const EventMapInner = withScriptjs(withGoogleMap((props) =>
  <GoogleMap
    defaultZoom={10}
    defaultCenter={{ lat: props.location.lat, lng: props.location.lng }}
  >
    <Marker
      position={{ lat: props.location.lat, lng: props.location.lng }}
    />
  </GoogleMap>
));

class EventMap extends Component {
  static propTypes = {
    address: PropTypes.string.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      loaded: false,
      location: null,
    };
  }

  componentDidMount() {
    // zlFetch does not work well here.
    fetch('https://maps.googleapis.com/maps/api/geocode/json?address=' + this.props.address).then(data => {
      data.json().then(json =>{
        const location = json.results && json.results.length ? json.results[0].geometry.location : null;
        console.log(json, location);
        this.setState({ loaded: true, location })
      });
    }).catch(error => console.log(error));
  }

  render() {
    const { loaded, location } = this.state;
    console.log('loaded, location:', loaded, location);
    if (loaded && location) {
      return (
        <EventMapInner
          googleMapURL="https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places"
          loadingElement={<div style={{ height: '100%' }} />}
          containerElement={<div style={{ height: '400px' }} />}
          mapElement={<div style={{ height: '100%' }} />}
          location={location}
          {...this.props}
        />
      );
    } else {
      return (<div style={{ height: '100%' }} />);
    }
  }
}

export default EventMap;


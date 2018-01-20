'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _reactGoogleMaps = require('react-google-maps');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var EventMapInner = (0, _reactGoogleMaps.withScriptjs)((0, _reactGoogleMaps.withGoogleMap)(function (props) {
  return _react2.default.createElement(
    _reactGoogleMaps.GoogleMap,
    {
      defaultZoom: 10,
      defaultCenter: { lat: props.location.lat, lng: props.location.lng }
    },
    _react2.default.createElement(_reactGoogleMaps.Marker, {
      position: { lat: props.location.lat, lng: props.location.lng }
    })
  );
}));

var EventMap = function (_Component) {
  _inherits(EventMap, _Component);

  function EventMap(props) {
    _classCallCheck(this, EventMap);

    var _this = _possibleConstructorReturn(this, (EventMap.__proto__ || Object.getPrototypeOf(EventMap)).call(this, props));

    _this.fetchLocation = function (address) {
      return fetch('https://maps.googleapis.com/maps/api/geocode/json?address=' + address + '&key=AIzaSyC7HLd3XbtydbQ8bYXY30EXvYCqLcBRINY').then(function (data) {
        return data.json().then(function (json) {
          return json.results && json.results.length ? json.results[0].geometry.location : null;
        });
      });
    };

    _this.state = {
      loaded: false,
      location: null
    };
    return _this;
  }

  _createClass(EventMap, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      var _this2 = this;

      var address = this.props.address || this.props.city + ', ' + this.props.country;
      this.fetchLocation(address).then(function (location) {
        if (location) {
          _this2.setState({ loaded: true, location: location });
        }
      });
    }

    // Fix: zlFetch does not work well here.

  }, {
    key: 'render',
    value: function render() {
      var language = this.props.language;
      var _state = this.state,
          loaded = _state.loaded,
          location = _state.location;

      if (loaded && location) {
        if (language === 'he') {
          language = 'iw';
        }
        return _react2.default.createElement(EventMapInner, Object.assign({
          googleMapURL: 'https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places&language=' + language + '&key=AIzaSyC7HLd3XbtydbQ8bYXY30EXvYCqLcBRINY',
          loadingElement: _react2.default.createElement('div', { style: { height: '100%' } }),
          containerElement: _react2.default.createElement('div', { style: { height: '200px' } }),
          mapElement: _react2.default.createElement('div', { style: { height: '100%' } }),
          location: location
        }, this.props));
      }
      return _react2.default.createElement('div', { style: { height: '100%' } });
    }
  }]);

  return EventMap;
}(_react.Component);

EventMap.propTypes = {
  language: _propTypes2.default.string.isRequired,
  address: _propTypes2.default.string,
  country: _propTypes2.default.string,
  city: _propTypes2.default.string
};
EventMap.defaultProps = {
  address: '',
  country: '',
  city: ''
};
exports.default = EventMap;
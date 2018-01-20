'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _semanticUiReact = require('semantic-ui-react');

var _image = require('../../images/image.png');

var _image2 = _interopRequireDefault(_image);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// An adaptation of https://github.com/socialtables/react-image-fallback
// for react semantic-ui
var FallbackImage = function (_Component) {
  _inherits(FallbackImage, _Component);

  function FallbackImage(props) {
    _classCallCheck(this, FallbackImage);

    var _this = _possibleConstructorReturn(this, (FallbackImage.__proto__ || Object.getPrototypeOf(FallbackImage)).call(this, props));

    _this.setDisplayImage = function (image, fallbacks) {
      var imagesArray = [image].concat(fallbacks).filter(function (fallback) {
        return !!fallback;
      });

      _this.displayImage.onerror = function () {
        if (imagesArray.length > 2 && typeof imagesArray[1] === 'string') {
          var updatedFallbacks = imagesArray.slice(2);
          _this.setDisplayImage(imagesArray[1], updatedFallbacks);
          return;
        }

        _this.setState({ imageSource: imagesArray[1] || null }, function () {
          if (_this.props.onError) {
            _this.props.onError(_this.props.src);
          }
        });
      };

      _this.displayImage.onload = function () {
        _this.setState({
          imageSource: imagesArray[0]
        }, function () {
          if (_this.props.onLoad) {
            _this.props.onLoad(imagesArray[0]);
          }
        });
      };

      if (typeof imagesArray[0] === 'string') {
        _this.displayImage.src = imagesArray[0];
      } else {
        _this.setState({
          imageSource: imagesArray[0]
        }, function () {
          if (_this.props.onLoad) {
            _this.props.onLoad(imagesArray[0]);
          }
        });
      }
    };

    _this.state = {
      imageSource: props.initialImage
    };
    return _this;
  }

  _createClass(FallbackImage, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.displayImage = new window.Image();
      this.setDisplayImage(this.props.src, this.props.fallbackImage);
    }
  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      if (nextProps.src !== this.props.src) {
        this.setDisplayImage(nextProps.src, nextProps.fallbackImage);
      }
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      if (this.displayImage) {
        this.displayImage.onerror = null;
        this.displayImage.onload = null;
        this.displayImage = null;
      }
    }
  }, {
    key: 'render',
    value: function render() {
      if (typeof this.state.imageSource !== 'string') {
        return this.state.imageSource;
      }

      var _props = this.props,
          initialImage = _props.initialImage,
          fallbackImage = _props.fallbackImage,
          onLoad = _props.onLoad,
          onError = _props.onError,
          rest = _objectWithoutProperties(_props, ['initialImage', 'fallbackImage', 'onLoad', 'onError']);

      return _react2.default.createElement(_semanticUiReact.Image, Object.assign({}, rest, { src: this.state.imageSource }));
    }
  }]);

  return FallbackImage;
}(_react.Component);

FallbackImage.propTypes = {
  src: _propTypes2.default.string,
  fallbackImage: _propTypes2.default.arrayOf(_propTypes2.default.oneOfType([_propTypes2.default.string, _propTypes2.default.element, _propTypes2.default.array])),
  initialImage: _propTypes2.default.oneOfType([_propTypes2.default.string, _propTypes2.default.element]),
  onLoad: _propTypes2.default.func,
  onError: _propTypes2.default.func
};
FallbackImage.defaultProps = {
  initialImage: null,
  fallbackImage: [_image2.default]
};
exports.default = FallbackImage;
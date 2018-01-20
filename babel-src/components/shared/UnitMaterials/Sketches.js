'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

require('react-image-gallery/styles/css/image-gallery.css');

var _reactImageGallery = require('react-image-gallery');

var _reactImageGallery2 = _interopRequireDefault(_reactImageGallery);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

//import PropTypes from 'prop-types';
//import classNames from 'classnames';

var Sketches = function (_React$Component) {
    _inherits(Sketches, _React$Component);

    function Sketches() {
        _classCallCheck(this, Sketches);

        return _possibleConstructorReturn(this, (Sketches.__proto__ || Object.getPrototypeOf(Sketches)).apply(this, arguments));
    }

    _createClass(Sketches, [{
        key: 'handleImageLoad',
        value: function handleImageLoad(event) {
            console.log('Image loaded ', event.target);
        }
    }, {
        key: 'render',
        value: function render() {
            var images = [{
                original: 'http://lorempixel.com/1000/600/nature/1/',
                thumbnail: 'http://lorempixel.com/250/150/nature/1/'
            }, {
                original: 'http://lorempixel.com/1000/600/nature/2/',
                thumbnail: 'http://lorempixel.com/250/150/nature/2/'
            }, {
                original: 'http://lorempixel.com/1000/600/nature/3/',
                thumbnail: 'http://lorempixel.com/250/150/nature/3/'
            }];

            return _react2.default.createElement(_reactImageGallery2.default, { items: images,
                slideInterval: 2000,
                onImageLoad: this.handleImageLoad,
                showPlayButton: false
            });
        }
    }]);

    return Sketches;
}(_react2.default.Component);

exports.default = Sketches;
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _semanticUiReact = require('semantic-ui-react');

var _consts = require('../../../helpers/consts');

var _date = require('../../../helpers/date');

var _shapes = require('../../shapes');

var shapes = _interopRequireWildcard(_shapes);

var _placeholder = require('./placeholder.png');

var _placeholder2 = _interopRequireDefault(_placeholder);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var PageHeader = function PageHeader(props) {
  var _props$item = props.item,
      name = _props$item.name,
      description = _props$item.description,
      start_date = _props$item.start_date,
      end_date = _props$item.end_date,
      country = _props$item.country,
      city = _props$item.city,
      fullAddress = _props$item.full_address;


  var addressLine = fullAddress;
  if (!addressLine) {
    if (city) {
      addressLine = city + ',' + country;
    } else {
      addressLine = country;
    }
  }

  return _react2.default.createElement(
    _semanticUiReact.Container,
    { className: 'padded' },
    _react2.default.createElement(
      _semanticUiReact.Grid,
      null,
      _react2.default.createElement(
        _semanticUiReact.Grid.Row,
        null,
        _react2.default.createElement(
          _semanticUiReact.Grid.Column,
          { width: 3 },
          _react2.default.createElement(_semanticUiReact.Image, { fluid: true, shape: 'rounded', src: _placeholder2.default })
        ),
        _react2.default.createElement(
          _semanticUiReact.Grid.Column,
          { width: 8 },
          _react2.default.createElement(
            _semanticUiReact.Header,
            { as: 'h1' },
            _react2.default.createElement(
              _semanticUiReact.Header.Content,
              null,
              _react2.default.createElement(
                'small',
                { className: 'text grey' },
                (0, _date.fromToLocalized)(_moment2.default.utc(start_date, _consts.DATE_FORMAT), _moment2.default.utc(end_date, _consts.DATE_FORMAT))
              ),
              _react2.default.createElement('br', null),
              name,
              _react2.default.createElement(
                _semanticUiReact.Header.Subheader,
                { style: { direction: 'ltr' } },
                addressLine
              )
            )
          ),
          description ? _react2.default.createElement(
            'p',
            null,
            description
          ) : null
        )
      )
    )
  );
};

PageHeader.propTypes = {
  item: shapes.EventCollection.isRequired
};

exports.default = PageHeader;
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _presetToRange;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _noop = require('lodash/noop');

var _noop2 = _interopRequireDefault(_noop);

var _reactDayPicker = require('react-day-picker');

var _reactDayPicker2 = _interopRequireDefault(_reactDayPicker);

var _moment3 = require('react-day-picker/moment');

var _moment4 = _interopRequireDefault(_moment3);

var _semanticUiReact = require('semantic-ui-react');

require('react-day-picker/lib/style.css');

var _consts = require('../../../helpers/consts');

var _connectFilter = require('../connectFilter');

var _connectFilter2 = _interopRequireDefault(_connectFilter);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

// TODO (yaniv -> oleg): need indication for user when clicking on a bad date (after today) or when typing bad dates

// must be locale aware
var DATE_DISPLAY_FORMAT = 'l';

var now = function now() {
  return (0, _moment2.default)(new Date()).hours(12).minutes(0).seconds(0).milliseconds(0).toDate();
};

var TODAY = 'TODAY';
var YESTERDAY = 'YESTERDAY';
var LAST_7_DAYS = 'LAST_7_DAYS';
var LAST_30_DAYS = 'LAST_30_DAYS';
var LAST_MONTH = 'LAST_MONTH';
var THIS_MONTH = 'THIS_MONTH';
var CUSTOM_RANGE = 'CUSTOM_RANGE';

var datePresets = [TODAY, YESTERDAY, LAST_7_DAYS, LAST_30_DAYS, LAST_MONTH, THIS_MONTH, CUSTOM_RANGE];

var presetToRange = (_presetToRange = {}, _defineProperty(_presetToRange, TODAY, function () {
  var today = (0, _moment2.default)().toDate();
  return { from: today, to: today };
}), _defineProperty(_presetToRange, YESTERDAY, function () {
  var yesterday = (0, _moment2.default)().subtract(1, 'days').toDate();
  return { from: yesterday, to: yesterday };
}), _defineProperty(_presetToRange, LAST_7_DAYS, function () {
  return {
    from: (0, _moment2.default)().subtract(6, 'days').toDate(),
    to: (0, _moment2.default)().toDate()
  };
}), _defineProperty(_presetToRange, LAST_30_DAYS, function () {
  return {
    from: (0, _moment2.default)().subtract(30, 'days').toDate(),
    to: (0, _moment2.default)().toDate()
  };
}), _defineProperty(_presetToRange, LAST_MONTH, function () {
  var todayMinusMonthMoment = (0, _moment2.default)().subtract(1, 'months');
  return {
    from: todayMinusMonthMoment.startOf('month').toDate(),
    to: todayMinusMonthMoment.endOf('month').toDate()
  };
}), _defineProperty(_presetToRange, THIS_MONTH, function () {
  return {
    from: (0, _moment2.default)().startOf('month').toDate(),
    to: (0, _moment2.default)().toDate()
  };
}), _presetToRange);

var rangeToPreset = function rangeToPreset(from, to) {
  if ((0, _moment2.default)(from, 'day').isSame(to, 'day')) {
    if ((0, _moment2.default)(to).isSame(now(), 'day')) {
      return TODAY;
    } else if ((0, _moment2.default)(to).isSame((0, _moment2.default)().subtract(1, 'days'), 'days')) {
      return YESTERDAY;
    }
  } else if ((0, _moment2.default)(to).subtract(6, 'days').isSame(from, 'day')) {
    return LAST_7_DAYS;
  } else if ((0, _moment2.default)(to).subtract(30, 'days').isSame(from, 'day') && (0, _moment2.default)(to).isSame((0, _moment2.default)(), 'day')) {
    return LAST_30_DAYS;
  } else if ((0, _moment2.default)().startOf('month').isSame(from, 'day') && (0, _moment2.default)().isSame(to, 'day')) {
    return THIS_MONTH;
  }

  var todayMinusMonthMoment = (0, _moment2.default)().subtract(1, 'months');
  if (todayMinusMonthMoment.startOf('month').isSame(from, 'day') && todayMinusMonthMoment.endOf('month').isSame(to, 'day')) {
    return LAST_MONTH;
  }

  return CUSTOM_RANGE;
};

var isValidDateRange = function isValidDateRange(fromValue, toValue) {
  var fromMoment = (0, _moment2.default)(fromValue, DATE_DISPLAY_FORMAT, true);
  var toMoment = (0, _moment2.default)(toValue, DATE_DISPLAY_FORMAT, true);

  return fromMoment.isValid() && toMoment.isValid() && fromMoment.isSameOrBefore(toMoment) && toMoment.isSameOrBefore(now());
};

var DateFilter = function (_Component) {
  _inherits(DateFilter, _Component);

  function DateFilter(props, context) {
    _classCallCheck(this, DateFilter);

    var _this = _possibleConstructorReturn(this, (DateFilter.__proto__ || Object.getPrototypeOf(DateFilter)).call(this, props, context));

    _initialiseProps.call(_this);

    _this.state = _this.convertToStateObject(_this.props);
    return _this;
  }

  _createClass(DateFilter, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      var _state = this.state,
          datePreset = _state.datePreset,
          from = _state.from,
          to = _state.to;

      this.showMonth(datePreset, from, to);
    }
  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      this.setState(this.convertToStateObject(nextProps));
    }

    /**
     * decides how to show to the visible months in the calendar
     */

  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      var _props = this.props,
          t = _props.t,
          language = _props.language;

      var isRTL = _consts.RTL_LANGUAGES.includes(language);

      var _state2 = this.state,
          fromInputValue = _state2.fromInputValue,
          toInputValue = _state2.toInputValue,
          from = _state2.from,
          to = _state2.to,
          datePreset = _state2.datePreset;


      var i18nPresetsOptions = datePresets.map(function (x) {
        return { text: t('filters.date-filter.presets.' + x), value: x };
      });

      return _react2.default.createElement(
        _semanticUiReact.Segment,
        { basic: true, attached: 'bottom', className: 'tab active' },
        _react2.default.createElement(
          _semanticUiReact.Grid,
          { divided: true },
          _react2.default.createElement(
            _semanticUiReact.Grid.Row,
            { columns: 16 },
            _react2.default.createElement(
              _semanticUiReact.Grid.Column,
              { width: 11 },
              _react2.default.createElement(_reactDayPicker2.default, {
                numberOfMonths: 2,
                selectedDays: { from: from, to: to },
                disabledDays: { after: new Date() },
                toMonth: now(),
                localeUtils: _moment4.default,
                locale: language,
                dir: isRTL ? 'rtl' : 'ltr',
                onDayClick: this.handleDayClick
                // eslint-disable-next-line no-return-assign
                , ref: function ref(el) {
                  return _this2.datePicker = el;
                }
              })
            ),
            _react2.default.createElement(
              _semanticUiReact.Grid.Column,
              { width: 5 },
              _react2.default.createElement(_semanticUiReact.Header, { content: t('filters.date-filter.selectTitle'), textAlign: 'center' }),
              _react2.default.createElement(
                _semanticUiReact.Grid,
                null,
                _react2.default.createElement(
                  _semanticUiReact.Grid.Row,
                  null,
                  _react2.default.createElement(
                    _semanticUiReact.Grid.Column,
                    { width: 16 },
                    _react2.default.createElement(_semanticUiReact.Dropdown, {
                      item: true,
                      fluid: true,
                      options: i18nPresetsOptions,
                      value: datePreset,
                      onChange: this.handleDatePresetsChange
                    }),
                    _react2.default.createElement(_semanticUiReact.Divider, null)
                  )
                ),
                _react2.default.createElement(
                  _semanticUiReact.Grid.Row,
                  null,
                  _react2.default.createElement(
                    _semanticUiReact.Grid.Column,
                    { width: 8 },
                    _react2.default.createElement(_semanticUiReact.Input, {
                      fluid: true,
                      placeholder: t('filters.date-filter.start'),
                      value: fromInputValue,
                      onChange: this.handleFromInputChange
                    })
                  ),
                  _react2.default.createElement(
                    _semanticUiReact.Grid.Column,
                    { width: 8 },
                    _react2.default.createElement(_semanticUiReact.Input, {
                      fluid: true,
                      placeholder: t('filters.date-filter.end'),
                      value: toInputValue,
                      onChange: this.handleToInputChange
                    })
                  )
                ),
                _react2.default.createElement(
                  _semanticUiReact.Grid.Row,
                  null,
                  _react2.default.createElement(
                    _semanticUiReact.Grid.Column,
                    { textAlign: 'right' },
                    _react2.default.createElement(_semanticUiReact.Button, { content: t('buttons.close'), onClick: this.onCancel }),
                    _react2.default.createElement(_semanticUiReact.Button, { primary: true, content: t('buttons.apply'), disabled: !this.canApply(), onClick: this.apply })
                  )
                )
              )
            )
          )
        )
      );
    }
  }]);

  return DateFilter;
}(_react.Component);

DateFilter.propTypes = {
  value: _propTypes2.default.shape({
    from: _propTypes2.default.objectOf(Date),
    to: _propTypes2.default.objectOf(Date),
    datePreset: _propTypes2.default.oneOfType([_propTypes2.default.number, _propTypes2.default.string])
  }),
  onCancel: _propTypes2.default.func,
  onApply: _propTypes2.default.func,
  updateValue: _propTypes2.default.func.isRequired,
  t: _propTypes2.default.func.isRequired,
  language: _propTypes2.default.string.isRequired
};
DateFilter.defaultProps = {
  onCancel: _noop2.default,
  onApply: _noop2.default,
  value: Object.assign({
    datePreset: TODAY
  }, presetToRange[TODAY]())
};

var _initialiseProps = function _initialiseProps() {
  var _this3 = this;

  this.onCancel = function () {
    return _this3.props.onCancel();
  };

  this.setRange = function (datePreset, from, to) {
    var fromInputValue = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : '';
    var toInputValue = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : '';

    var range = {};

    // calculate range in regard to the date preset
    if (datePreset === CUSTOM_RANGE) {
      range.from = from || _this3.state.from;
      range.to = to || _this3.state.to;
    } else {
      range = (presetToRange[datePreset] || presetToRange[TODAY])();
    }

    // try to show entire range in calendar
    if (datePreset !== CUSTOM_RANGE || datePreset === CUSTOM_RANGE && range && range.from) {
      _this3.showMonth(datePreset, range.from, range.to);
    }

    var momentFrom = (0, _moment2.default)(new Date(range.from));
    var momentTo = (0, _moment2.default)(new Date(range.to));

    _this3.setState(Object.assign({}, range, {
      datePreset: datePreset,
      fromInputValue: fromInputValue || (momentFrom.isValid() ? momentFrom.format(DATE_DISPLAY_FORMAT) : ''),
      toInputValue: toInputValue || (momentTo.isValid() ? momentTo.format(DATE_DISPLAY_FORMAT) : '')
    }));
  };

  this.convertToStateObject = function (props) {
    var _props$value = props.value,
        from = _props$value.from,
        to = _props$value.to,
        datePreset = _props$value.datePreset;


    return {
      from: from,
      to: to,
      datePreset: datePreset || rangeToPreset(from, to),
      fromInputValue: (0, _moment2.default)(from, _consts.DATE_FORMAT).format(DATE_DISPLAY_FORMAT),
      toInputValue: (0, _moment2.default)(to, _consts.DATE_FORMAT).format(DATE_DISPLAY_FORMAT)
    };
  };

  this.showMonth = function (preset, from, to) {
    var dateToShow = from;
    // eslint-disable-next-line default-case
    switch (preset) {
      case TODAY:
      case YESTERDAY:
        dateToShow = (0, _moment2.default)(from).subtract(1, 'month').toDate();
        break;
      case LAST_7_DAYS:
      case LAST_30_DAYS:
        if ((0, _moment2.default)(from).month() < (0, _moment2.default)(to).month()) {
          dateToShow = from;
        } else {
          dateToShow = (0, _moment2.default)(from).subtract(1, 'month').toDate();
        }
        break;
      case LAST_MONTH:
        dateToShow = (0, _moment2.default)(now()).subtract(2, 'month').toDate();
        break;
      case THIS_MONTH:
        dateToShow = (0, _moment2.default)(now()).subtract(1, 'month').toDate();
        break;
    }

    _this3.datePicker.showMonth(dateToShow);
  };

  this.apply = function () {
    var _state3 = _this3.state,
        from = _state3.from,
        to = _state3.to,
        datePreset = _state3.datePreset;

    _this3.props.updateValue({ from: from, to: to, datePreset: datePreset });
    _this3.props.onApply();
  };

  this.handleDayClick = function (day) {
    if ((0, _moment2.default)(day).isAfter(now())) {
      return;
    }

    var _state4 = _this3.state,
        from = _state4.from,
        to = _state4.to;

    var range = _reactDayPicker.DateUtils.addDayToRange(day, { from: from, to: to });

    _this3.setRange(CUSTOM_RANGE, range.from, range.to);
  };

  this.handleDatePresetsChange = function (event, data) {
    return _this3.setRange(data.value);
  };

  this.handleFromInputChange = function (event) {
    var value = event.target.value;
    var momentValue = (0, _moment2.default)(value, DATE_DISPLAY_FORMAT, true);

    var isValid = momentValue.isValid();
    if (isValid && isValidDateRange(value, _this3.state.toInputValue)) {
      _this3.setRange(CUSTOM_RANGE, momentValue.toDate(), (0, _moment2.default)(_this3.state.toInputValue, DATE_DISPLAY_FORMAT, true).toDate(), value, _this3.state.toInputValue);
    } else {
      _this3.setState({
        fromInputValue: value
      });
    }
  };

  this.handleToInputChange = function (event) {
    var value = event.target.value;
    var momentValue = (0, _moment2.default)(value, DATE_DISPLAY_FORMAT, true);

    var isValid = momentValue.isValid();
    if (isValid && isValidDateRange(_this3.state.fromInputValue, value)) {
      _this3.setRange(CUSTOM_RANGE, (0, _moment2.default)(_this3.state.fromInputValue, DATE_DISPLAY_FORMAT, true).toDate(), momentValue.toDate(), _this3.state.fromInputValue, value);
    } else {
      _this3.setState({
        toInputValue: value
      });
    }
  };

  this.canApply = function () {
    return isValidDateRange(_this3.state.fromInputValue, _this3.state.toInputValue);
  };
};

exports.default = (0, _connectFilter2.default)()(DateFilter);
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _redux = require('redux');

var _reactRedux = require('react-redux');

require('moment-duration-format');

var _consts = require('../../../../helpers/consts');

var _mdb = require('../../../../redux/modules/mdb');

var _events = require('../../../../redux/modules/events');

var _shapes = require('../../../shapes');

var shapes = _interopRequireWildcard(_shapes);

var _RelevantParts = require('./RelevantParts');

var _RelevantParts2 = _interopRequireDefault(_RelevantParts);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var getRelevantCollectionId = function getRelevantCollectionId(unit) {
  if (unit.collections) {
    var collections = Object.values(unit.collections);
    var relevantCollection = collections.find(function (collection) {
      return _consts.EVENT_TYPES.indexOf(collection.content_type) !== -1;
    });

    if (relevantCollection) {
      return relevantCollection.id;
    }
  }

  return null;
};

var RelevantPartsContainer = function (_Component) {
  _inherits(RelevantPartsContainer, _Component);

  function RelevantPartsContainer() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, RelevantPartsContainer);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = RelevantPartsContainer.__proto__ || Object.getPrototypeOf(RelevantPartsContainer)).call.apply(_ref, [this].concat(args))), _this), _this.state = {
      fullCollectionRequested: false
    }, _this.askForDataIfNeeded = function (props) {
      var collectionID = props.collectionID,
          wip = props.wip,
          err = props.err,
          fetchCollection = props.fetchCollection;

      // TODO:
      // Maybe in the future we'll do something more sophisticated
      // to fetch data only in the case we really need it
      // The following code is wrong.
      //
      // We fetch stuff if we don't have it already
      // and a request for it is not in progress or ended with an error.
      // if (
      //   collection &&
      //   collection.id === collectionID &&
      //   Array.isArray(collection.content_units)) {
      //   return;
      // }

      if (_this.state.fullCollectionRequested) {
        return;
      }

      if (collectionID && !(wip || err)) {
        fetchCollection(collectionID);
        _this.setState({ fullCollectionRequested: true });
      }
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(RelevantPartsContainer, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.askForDataIfNeeded(this.props);
    }
  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      this.askForDataIfNeeded(nextProps);
    }
  }, {
    key: 'render',
    value: function render() {
      var _props = this.props,
          unit = _props.unit,
          collection = _props.collection,
          wip = _props.wip,
          err = _props.err,
          t = _props.t;


      return _react2.default.createElement(_RelevantParts2.default, {
        unit: unit,
        wip: wip,
        err: err,
        collection: wip || err ? null : collection,
        t: t
      });
    }
  }]);

  return RelevantPartsContainer;
}(_react.Component);

RelevantPartsContainer.propTypes = {
  unit: shapes.EventItem.isRequired,
  collectionID: _propTypes2.default.string,
  collection: shapes.GenericCollection,
  wip: shapes.WIP,
  err: shapes.Error,
  fetchCollection: _propTypes2.default.func.isRequired,
  t: _propTypes2.default.func.isRequired
};
RelevantPartsContainer.defaultProps = {
  collection: null,
  collectionID: '',
  wip: false,
  err: null
};
exports.default = (0, _reactRedux.connect)(function (state, ownProps) {
  var collectionID = getRelevantCollectionId(ownProps.unit);
  return {
    collectionID: collectionID,
    collection: collectionID ? _mdb.selectors.getDenormCollection(state.mdb, collectionID) : null,
    wip: _events.selectors.getWip(state.events).fulls[collectionID],
    errors: _events.selectors.getErrors(state.events).fulls[collectionID]
  };
}, function (dispatch) {
  return (0, _redux.bindActionCreators)({
    fetchCollection: _events.actions.fetchFullEvent
  }, dispatch);
})(RelevantPartsContainer);
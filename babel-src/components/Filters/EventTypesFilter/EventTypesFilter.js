'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _reactRedux = require('react-redux');

var _events = require('../../../redux/modules/events');

var _DeepListFilter = require('../common/DeepListFilter');

var _DeepListFilter2 = _interopRequireDefault(_DeepListFilter);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = (0, _reactRedux.connect)(function (state) {
  var tree = _events.selectors.getEventFilterTree(state.events);

  return {
    emptyLabel: 'No Events',
    roots: tree.roots,
    getSubItemById: function getSubItemById(id) {
      return tree.byIds[id];
    }
  };
})(_DeepListFilter2.default);
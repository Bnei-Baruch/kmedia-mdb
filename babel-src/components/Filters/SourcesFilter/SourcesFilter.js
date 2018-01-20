'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _reactRedux = require('react-redux');

var _sources = require('../../../redux/modules/sources');

var _DeepListFilter = require('../common/DeepListFilter');

var _DeepListFilter2 = _interopRequireDefault(_DeepListFilter);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = (0, _reactRedux.connect)(function (state) {
  return {
    emptyLabel: 'No Sources',
    roots: _sources.selectors.getRoots(state.sources),
    getSubItemById: _sources.selectors.getSourceById(state.sources)
  };
})(_DeepListFilter2.default);
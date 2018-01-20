'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SuggestionsHelper = undefined;

var _uniqBy = require('lodash/uniqBy');

var _uniqBy2 = _interopRequireDefault(_uniqBy);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var SuggestionsHelper = exports.SuggestionsHelper = function SuggestionsHelper(autocompleteResults) {
  var _this = this;

  _classCallCheck(this, SuggestionsHelper);

  this.getSuggestions = function (type) {
    var topN = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 5;

    var x = _this.byType[type] || {};
    var combined = (0, _uniqBy2.default)((x.name || []).concat(x.description || []), 'id');
    return combined.slice(0, topN);
  };

  this.$$addSuggestion = function (option, field) {
    var _index = option._index,
        text = option.text,
        type = option._type,
        _source = option._source;
    var id = _source.mdb_uid;
    // TODO: Fix that to return detected language explicitly!

    var language = _index.split('_').slice(-1)[0];
    var item = { id: id, type: type, text: text, language: language };

    var typeItems = _this.byType[type];
    if (typeItems) {
      var fieldItems = typeItems[field];
      if (Array.isArray(fieldItems)) {
        fieldItems.push(item);
      } else {
        _this.byType[type][field] = [item];
      }
    } else {
      _this.byType[type] = _defineProperty({}, field, [item]);
    }
  };

  this.byType = {};
  if (Array.isArray(autocompleteResults)) {
    autocompleteResults.forEach(function (results) {
      console.log(results.suggest);
      if (results.suggest) {
        results.suggest['classification_name'][0].options.forEach(function (x) {
          return _this.$$addSuggestion(x, 'name');
        });
        results.suggest['classification_description'][0].options.forEach(function (x) {
          return _this.$$addSuggestion(x, 'description');
        });
      }
    });
  }
};
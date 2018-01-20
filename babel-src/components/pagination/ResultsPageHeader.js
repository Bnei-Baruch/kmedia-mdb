'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _reactI18next = require('react-i18next');

var _semanticUiReact = require('semantic-ui-react');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ResultsPageHeader = function ResultsPageHeader(props) {
  var pageNo = props.pageNo,
      pageSize = props.pageSize,
      total = props.total,
      t = props.t;


  if (total === 0) {
    return _react2.default.createElement(_semanticUiReact.Header, { as: 'h2', content: t('messages.no-results') });
  }

  if (total <= pageSize) {
    return _react2.default.createElement(_semanticUiReact.Header, {
      as: 'h2',
      content: t('messages.pagination-results', { start: 1, end: total, total: total })
    });
  }

  return _react2.default.createElement(_semanticUiReact.Header, {
    as: 'h2',
    content: t('messages.pagination-results', {
      start: (pageNo - 1) * pageSize + 1,
      end: Math.min(total, pageNo * pageSize),
      total: total
    })
  });
};

ResultsPageHeader.propTypes = {
  pageNo: _propTypes2.default.number.isRequired,
  pageSize: _propTypes2.default.number.isRequired,
  total: _propTypes2.default.number.isRequired,
  t: _propTypes2.default.func.isRequired
};

ResultsPageHeader.defaultProps = {};

exports.default = (0, _reactI18next.translate)()(ResultsPageHeader);
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

var Footer = function Footer(props) {
  var t = props.t;

  var year = new Date().getFullYear();

  return _react2.default.createElement(
    'div',
    { className: 'layout__footer' },
    _react2.default.createElement(
      _semanticUiReact.Container,
      null,
      _react2.default.createElement(
        _semanticUiReact.Grid,
        { padded: true, inverted: true },
        _react2.default.createElement(
          _semanticUiReact.Grid.Row,
          null,
          _react2.default.createElement(
            _semanticUiReact.Grid.Column,
            null,
            _react2.default.createElement(
              _semanticUiReact.Grid,
              { columns: 'equal' },
              _react2.default.createElement(
                _semanticUiReact.Grid.Row,
                null,
                _react2.default.createElement(
                  _semanticUiReact.Grid.Column,
                  null,
                  _react2.default.createElement(
                    _semanticUiReact.Header,
                    { inverted: true, as: 'h3' },
                    t('nav.top.header'),
                    _react2.default.createElement('br', null),
                    _react2.default.createElement(
                      'small',
                      { className: 'text grey' },
                      t('nav.footer.copyright', { year: year }),
                      ' ',
                      t('nav.footer.rights')
                    )
                  )
                ),
                _react2.default.createElement(
                  _semanticUiReact.Grid.Column,
                  null,
                  _react2.default.createElement(
                    _semanticUiReact.Header,
                    { inverted: true, as: 'h3' },
                    'Study Materials'
                  ),
                  _react2.default.createElement(
                    _semanticUiReact.Menu,
                    { text: true, vertical: true, inverted: true },
                    _react2.default.createElement(_semanticUiReact.Menu.Item, { name: t('nav.sidebar.lessons') }),
                    _react2.default.createElement(_semanticUiReact.Menu.Item, { name: t('nav.sidebar.lectures') }),
                    _react2.default.createElement(_semanticUiReact.Menu.Item, { name: t('nav.sidebar.sources') }),
                    _react2.default.createElement(_semanticUiReact.Menu.Item, { name: t('nav.sidebar.books') })
                  )
                ),
                _react2.default.createElement(
                  _semanticUiReact.Grid.Column,
                  null,
                  _react2.default.createElement(
                    _semanticUiReact.Header,
                    { inverted: true, as: 'h3' },
                    'Kabbalah Topics'
                  ),
                  _react2.default.createElement(
                    _semanticUiReact.Menu,
                    { text: true, vertical: true, inverted: true },
                    _react2.default.createElement(_semanticUiReact.Menu.Item, { name: 'Work in the group' }),
                    _react2.default.createElement(_semanticUiReact.Menu.Item, { name: 'Life according to kabbalah' }),
                    _react2.default.createElement(_semanticUiReact.Menu.Item, { name: 'Dissemination' }),
                    _react2.default.createElement(_semanticUiReact.Menu.Item, { name: 'Weekly Torah portion' })
                  )
                ),
                _react2.default.createElement(
                  _semanticUiReact.Grid.Column,
                  null,
                  _react2.default.createElement(
                    _semanticUiReact.Header,
                    { inverted: true, as: 'h3' },
                    'Kabbalah Events'
                  ),
                  _react2.default.createElement(
                    _semanticUiReact.Menu,
                    { text: true, vertical: true, inverted: true },
                    _react2.default.createElement(_semanticUiReact.Menu.Item, { name: 'World congresses' }),
                    _react2.default.createElement(_semanticUiReact.Menu.Item, { name: 'Unity day' }),
                    _react2.default.createElement(_semanticUiReact.Menu.Item, { name: 'Assembly of friends' })
                  )
                ),
                _react2.default.createElement(
                  _semanticUiReact.Grid.Column,
                  null,
                  _react2.default.createElement(
                    _semanticUiReact.Header,
                    { inverted: true, as: 'h3' },
                    'Media'
                  ),
                  _react2.default.createElement(
                    _semanticUiReact.Menu,
                    { text: true, vertical: true, inverted: true },
                    _react2.default.createElement(_semanticUiReact.Menu.Item, { name: t('nav.sidebar.programs') }),
                    _react2.default.createElement(_semanticUiReact.Menu.Item, { name: t('nav.sidebar.publications') }),
                    _react2.default.createElement(_semanticUiReact.Menu.Item, { name: t('nav.sidebar.photos') })
                  )
                )
              )
            )
          )
        )
      )
    )
  );
};
Footer.propTypes = {
  t: _propTypes2.default.func.isRequired
};

exports.default = (0, _reactI18next.translate)()(Footer);
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _semanticUiReact = require('semantic-ui-react');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /* eslint-disable */

var results = {
  "search": {
    "icon": "search",
    "name": "Search",
    "results": [{ "title": "tod" }]
  },
  "date": {
    "icon": "calendar",
    "name": "Date",
    "results": [{ "title": "Today" }]
  },
  "sources": {
    "icon": "book",
    "name": "Sources",
    "results": [{ "title": "Rabash > Articles > You Stand Today, All of You" }]
  },
  "topics": {
    "icon": "tag",
    "name": "Topics",
    "results": [{ "title": "Kabbalah today" }, { "title": "Today and Tomorrow" }]
  }
};
var categoryRenderer = function categoryRenderer(_ref) {
  var name = _ref.name,
      icon = _ref.icon;
  return _react2.default.createElement(
    'div',
    null,
    _react2.default.createElement(_semanticUiReact.Icon, { name: icon }),
    name
  );
};
var resultRenderer = function resultRenderer(_ref2) {
  var title = _ref2.title;
  return _react2.default.createElement(
    'div',
    null,
    title
  );
};

var Design = function (_Component) {
  _inherits(Design, _Component);

  function Design() {
    _classCallCheck(this, Design);

    return _possibleConstructorReturn(this, (Design.__proto__ || Object.getPrototypeOf(Design)).apply(this, arguments));
  }

  _createClass(Design, [{
    key: 'render',
    value: function render() {
      return _react2.default.createElement(
        'div',
        null,
        _react2.default.createElement(
          'div',
          { className: 'section-header' },
          _react2.default.createElement(
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
                  { computer: 10, tablet: 12, mobile: 16 },
                  _react2.default.createElement(
                    _semanticUiReact.Header,
                    { as: 'h1', color: 'blue' },
                    _react2.default.createElement(
                      _semanticUiReact.Header.Content,
                      null,
                      'Programs',
                      _react2.default.createElement(
                        _semanticUiReact.Header.Subheader,
                        null,
                        'The daily acceptance rate is delivered by Rabbi Dr. Michael Laitman to millions of viewers around the world, every night between 3-6 clock Israel, and describes the spiritual flow that humanity today.'
                      )
                    )
                  )
                )
              )
            )
          )
        ),
        _react2.default.createElement(_semanticUiReact.Divider, { fitted: true }),
        _react2.default.createElement(
          _semanticUiReact.Menu,
          { secondary: true, pointing: true, color: 'blue', className: 'index-filters', size: 'large' },
          _react2.default.createElement(
            _semanticUiReact.Container,
            { className: 'padded horizontally' },
            _react2.default.createElement(
              _semanticUiReact.Menu.Item,
              { header: true },
              'Filter Programs by:'
            ),
            _react2.default.createElement(
              _semanticUiReact.Menu.Item,
              { active: true },
              'Genre/Program',
              _react2.default.createElement(_semanticUiReact.Icon, { name: 'dropdown' })
            ),
            _react2.default.createElement(
              _semanticUiReact.Menu.Item,
              null,
              'Topics',
              _react2.default.createElement(_semanticUiReact.Icon, { name: 'dropdown' })
            ),
            _react2.default.createElement(
              _semanticUiReact.Menu.Item,
              null,
              'Date',
              _react2.default.createElement(_semanticUiReact.Icon, { name: 'dropdown' })
            )
          )
        ),
        _react2.default.createElement(
          _semanticUiReact.Container,
          { className: 'padded horizontally' },
          _react2.default.createElement(
            _semanticUiReact.Segment,
            { vertical: true, className: 'tab active', style: {
                padding: '0'
              } },
            _react2.default.createElement(
              'div',
              { className: 'filter-steps' },
              _react2.default.createElement(
                'div',
                { className: 'filter-steps__column-wrapper' },
                _react2.default.createElement(
                  'div',
                  { className: 'filter-steps__column' },
                  _react2.default.createElement(
                    _semanticUiReact.Menu,
                    { vertical: true, color: 'blue', size: 'tiny', fluid: true },
                    _react2.default.createElement(
                      _semanticUiReact.Menu.Item,
                      { active: true },
                      'All Programms'
                    ),
                    _react2.default.createElement(
                      _semanticUiReact.Menu.Item,
                      null,
                      'Children'
                    ),
                    _react2.default.createElement(
                      _semanticUiReact.Menu.Item,
                      null,
                      'Talk Show'
                    ),
                    _react2.default.createElement(
                      _semanticUiReact.Menu.Item,
                      null,
                      'Late Night'
                    )
                  )
                )
              ),
              _react2.default.createElement(
                'div',
                { className: 'filter-steps__column-wrapper' },
                _react2.default.createElement(
                  'div',
                  { className: 'filter-steps__column' },
                  _react2.default.createElement(
                    _semanticUiReact.Grid,
                    { padded: true, className: 'filter-steps__lists', columns: 5 },
                    _react2.default.createElement(
                      _semanticUiReact.Grid.Row,
                      { stretched: true },
                      _react2.default.createElement(
                        _semanticUiReact.Grid.Column,
                        { width: 16 },
                        _react2.default.createElement(
                          _semanticUiReact.Header,
                          { as: 'h6', color: 'grey' },
                          'Recently Updated'
                        )
                      ),
                      _react2.default.createElement(
                        _semanticUiReact.Grid.Column,
                        null,
                        _react2.default.createElement(_semanticUiReact.Card, {
                          href: '#',
                          header: 'Between Words',
                          meta: 'A new parts added: Today'
                        })
                      ),
                      _react2.default.createElement(
                        _semanticUiReact.Grid.Column,
                        null,
                        _react2.default.createElement(_semanticUiReact.Card, {
                          href: '#',
                          header: 'Between Words',
                          meta: 'A new parts added: Today'
                        })
                      ),
                      _react2.default.createElement(
                        _semanticUiReact.Grid.Column,
                        null,
                        _react2.default.createElement(_semanticUiReact.Card, {
                          href: '#',
                          header: 'Between Words',
                          meta: 'A new parts added: Today'
                        })
                      ),
                      _react2.default.createElement(
                        _semanticUiReact.Grid.Column,
                        null,
                        _react2.default.createElement(_semanticUiReact.Card, {
                          href: '#',
                          header: 'Between Words',
                          meta: 'A new parts added: Today'
                        })
                      ),
                      _react2.default.createElement(
                        _semanticUiReact.Grid.Column,
                        null,
                        _react2.default.createElement(_semanticUiReact.Card, {
                          href: '#',
                          header: 'Between Words',
                          meta: 'A new parts added: Today'
                        })
                      )
                    ),
                    _react2.default.createElement(
                      _semanticUiReact.Grid.Row,
                      null,
                      _react2.default.createElement(
                        _semanticUiReact.Grid.Column,
                        { width: 16 },
                        _react2.default.createElement(
                          _semanticUiReact.Header,
                          { as: 'h6', color: 'grey' },
                          'All Programs'
                        )
                      ),
                      _react2.default.createElement(
                        _semanticUiReact.Grid.Column,
                        null,
                        _react2.default.createElement(
                          _semanticUiReact.List,
                          { size: 'tiny' },
                          _react2.default.createElement(
                            _semanticUiReact.List.Item,
                            null,
                            _react2.default.createElement(
                              _semanticUiReact.List.Header,
                              null,
                              '#',
                              _react2.default.createElement(_semanticUiReact.Divider, null)
                            )
                          ),
                          _react2.default.createElement(
                            _semanticUiReact.List.Item,
                            null,
                            '20 Ideas'
                          )
                        )
                      ),
                      _react2.default.createElement(
                        _semanticUiReact.Grid.Column,
                        null,
                        _react2.default.createElement(
                          _semanticUiReact.List,
                          { size: 'tiny' },
                          _react2.default.createElement(
                            _semanticUiReact.List.Item,
                            null,
                            _react2.default.createElement(
                              _semanticUiReact.List.Header,
                              null,
                              'A',
                              _react2.default.createElement(_semanticUiReact.Divider, null)
                            )
                          ),
                          _react2.default.createElement(
                            _semanticUiReact.List.Item,
                            null,
                            'A New Life'
                          ),
                          _react2.default.createElement(
                            _semanticUiReact.List.Item,
                            null,
                            'A New Life. Excerpts'
                          ),
                          _react2.default.createElement(
                            _semanticUiReact.List.Item,
                            null,
                            'A Point in the Heart'
                          ),
                          _react2.default.createElement(
                            _semanticUiReact.List.Item,
                            { inverted: true },
                            'A song from the source'
                          ),
                          _react2.default.createElement(
                            _semanticUiReact.List.Item,
                            null,
                            'A Song Out of the Sleeve'
                          ),
                          _react2.default.createElement(
                            _semanticUiReact.List.Item,
                            null,
                            'A Spiritual Story with Eran Kurtz'
                          ),
                          _react2.default.createElement(
                            _semanticUiReact.List.Item,
                            null,
                            'A Taste of Light'
                          ),
                          _react2.default.createElement(
                            _semanticUiReact.List.Item,
                            null,
                            'All together'
                          ),
                          _react2.default.createElement(
                            _semanticUiReact.List.Item,
                            null,
                            'Among Friends'
                          ),
                          _react2.default.createElement(
                            _semanticUiReact.List.Item,
                            null,
                            'Ask the Kabbalist'
                          ),
                          _react2.default.createElement(
                            _semanticUiReact.List.Item,
                            null,
                            'Ask the kabbalist'
                          ),
                          _react2.default.createElement(
                            _semanticUiReact.List.Item,
                            null,
                            'At six on 66'
                          ),
                          _react2.default.createElement(
                            _semanticUiReact.List.Item,
                            null,
                            'Audio Program'
                          )
                        )
                      ),
                      _react2.default.createElement(
                        _semanticUiReact.Grid.Column,
                        null,
                        _react2.default.createElement(
                          _semanticUiReact.List,
                          { size: 'tiny' },
                          _react2.default.createElement(
                            _semanticUiReact.List.Item,
                            null,
                            _react2.default.createElement(
                              _semanticUiReact.List.Header,
                              null,
                              'B',
                              _react2.default.createElement(_semanticUiReact.Divider, null)
                            )
                          ),
                          _react2.default.createElement(
                            _semanticUiReact.List.Item,
                            null,
                            'Babylon Yesterday and Today'
                          ),
                          _react2.default.createElement(
                            _semanticUiReact.List.Item,
                            null,
                            'Backstage with'
                          ),
                          _react2.default.createElement(
                            _semanticUiReact.List.Item,
                            null,
                            'Basics'
                          ),
                          _react2.default.createElement(
                            _semanticUiReact.List.Item,
                            null,
                            'Behind the Words'
                          ),
                          _react2.default.createElement(
                            _semanticUiReact.List.Item,
                            null,
                            'Between Parents and Children'
                          ),
                          _react2.default.createElement(
                            _semanticUiReact.List.Item,
                            null,
                            'Between Us'
                          ),
                          _react2.default.createElement(
                            _semanticUiReact.List.Item,
                            null,
                            'Between Words'
                          ),
                          _react2.default.createElement(
                            _semanticUiReact.List.Item,
                            null,
                            'Book about Israel'
                          ),
                          _react2.default.createElement(
                            _semanticUiReact.List.Item,
                            null,
                            'Business and the new reality'
                          ),
                          _react2.default.createElement(
                            _semanticUiReact.List.Item,
                            null,
                            'Butterfly Effect'
                          )
                        )
                      ),
                      _react2.default.createElement(
                        _semanticUiReact.Grid.Column,
                        null,
                        _react2.default.createElement(
                          _semanticUiReact.List,
                          { size: 'tiny' },
                          _react2.default.createElement(
                            _semanticUiReact.List.Item,
                            null,
                            _react2.default.createElement(
                              _semanticUiReact.List.Header,
                              null,
                              'C',
                              _react2.default.createElement(_semanticUiReact.Divider, null)
                            )
                          ),
                          _react2.default.createElement(
                            _semanticUiReact.List.Item,
                            null,
                            'Child\'s Play'
                          ),
                          _react2.default.createElement(
                            _semanticUiReact.List.Item,
                            null,
                            'Children\'s World'
                          ),
                          _react2.default.createElement(
                            _semanticUiReact.List.Item,
                            null,
                            'Closeup'
                          ),
                          _react2.default.createElement(
                            _semanticUiReact.List.Item,
                            null,
                            'Company'
                          ),
                          _react2.default.createElement(
                            _semanticUiReact.List.Item,
                            null,
                            'Connecting for Good'
                          ),
                          _react2.default.createElement(
                            _semanticUiReact.List.Item,
                            null,
                            'Conversations with Kabbalist'
                          ),
                          _react2.default.createElement(
                            _semanticUiReact.List.Item,
                            null,
                            'Crossroads'
                          )
                        )
                      ),
                      _react2.default.createElement(
                        _semanticUiReact.Grid.Column,
                        null,
                        _react2.default.createElement(
                          _semanticUiReact.List,
                          { size: 'tiny' },
                          _react2.default.createElement(
                            _semanticUiReact.List.Item,
                            null,
                            _react2.default.createElement(
                              _semanticUiReact.List.Header,
                              null,
                              'E',
                              _react2.default.createElement(_semanticUiReact.Divider, null)
                            )
                          ),
                          _react2.default.createElement(
                            _semanticUiReact.List.Item,
                            null,
                            'Education Issues'
                          ),
                          _react2.default.createElement(
                            _semanticUiReact.List.Item,
                            null,
                            'Essentials of education'
                          ),
                          _react2.default.createElement(
                            _semanticUiReact.List.Item,
                            null,
                            'Experts'
                          )
                        )
                      ),
                      _react2.default.createElement(
                        _semanticUiReact.Grid.Column,
                        null,
                        _react2.default.createElement(
                          _semanticUiReact.List,
                          { size: 'tiny' },
                          _react2.default.createElement(
                            _semanticUiReact.List.Item,
                            null,
                            _react2.default.createElement(
                              _semanticUiReact.List.Header,
                              null,
                              'F',
                              _react2.default.createElement(_semanticUiReact.Divider, null)
                            )
                          ),
                          _react2.default.createElement(
                            _semanticUiReact.List.Item,
                            null,
                            'Films'
                          )
                        )
                      ),
                      _react2.default.createElement(
                        _semanticUiReact.Grid.Column,
                        null,
                        _react2.default.createElement(
                          _semanticUiReact.List,
                          { size: 'tiny' },
                          _react2.default.createElement(
                            _semanticUiReact.List.Item,
                            null,
                            _react2.default.createElement(
                              _semanticUiReact.List.Header,
                              null,
                              'G',
                              _react2.default.createElement(_semanticUiReact.Divider, null)
                            )
                          ),
                          _react2.default.createElement(
                            _semanticUiReact.List.Item,
                            null,
                            'Getting ready for the congress'
                          ),
                          _react2.default.createElement(
                            _semanticUiReact.List.Item,
                            null,
                            'Global Village'
                          ),
                          _react2.default.createElement(
                            _semanticUiReact.List.Item,
                            null,
                            'Good environment'
                          ),
                          _react2.default.createElement(
                            _semanticUiReact.List.Item,
                            null,
                            'Good time'
                          ),
                          _react2.default.createElement(
                            _semanticUiReact.List.Item,
                            null,
                            'Great Kabbalists'
                          )
                        )
                      ),
                      _react2.default.createElement(
                        _semanticUiReact.Grid.Column,
                        null,
                        _react2.default.createElement(
                          _semanticUiReact.List,
                          { size: 'tiny' },
                          _react2.default.createElement(
                            _semanticUiReact.List.Item,
                            null,
                            _react2.default.createElement(
                              _semanticUiReact.List.Header,
                              null,
                              'H',
                              _react2.default.createElement(_semanticUiReact.Divider, null)
                            )
                          ),
                          _react2.default.createElement(
                            _semanticUiReact.List.Item,
                            null,
                            'Hasidism'
                          ),
                          _react2.default.createElement(
                            _semanticUiReact.List.Item,
                            null,
                            'Hot Topic'
                          ),
                          _react2.default.createElement(
                            _semanticUiReact.List.Item,
                            null,
                            'HR Secrets Revealed'
                          )
                        )
                      )
                    )
                  )
                )
              )
            )
          ),
          _react2.default.createElement(
            _semanticUiReact.Segment,
            { vertical: true, clearing: true },
            _react2.default.createElement(_semanticUiReact.Button, { primary: true, content: 'Apply', floated: 'right' }),
            _react2.default.createElement(_semanticUiReact.Button, { content: 'Cancel', floated: 'right' })
          )
        ),
        _react2.default.createElement(
          _semanticUiReact.Grid.Column,
          { width: 16 },
          _react2.default.createElement(
            _semanticUiReact.Header,
            { size: 'large', color: 'pink', inverted: true },
            'Event Collection'
          ),
          _react2.default.createElement(_semanticUiReact.Divider, null),
          _react2.default.createElement(
            _semanticUiReact.Container,
            { className: 'padded' },
            _react2.default.createElement(
              _semanticUiReact.Menu,
              null,
              _react2.default.createElement(
                _semanticUiReact.Menu.Item,
                { header: true },
                'Filter Programs by:'
              ),
              _react2.default.createElement(
                _semanticUiReact.Menu.Item,
                { fitted: 'vertically', active: true },
                _react2.default.createElement(
                  'div',
                  null,
                  _react2.default.createElement(
                    'small',
                    null,
                    'Genre/Program'
                  ),
                  _react2.default.createElement('br', null),
                  'All'
                ),
                _react2.default.createElement(_semanticUiReact.Icon, { name: 'dropdown' })
              ),
              _react2.default.createElement(
                _semanticUiReact.Menu.Item,
                { fitted: 'vertically' },
                _react2.default.createElement(
                  'div',
                  null,
                  _react2.default.createElement(
                    'small',
                    null,
                    'Topics'
                  ),
                  _react2.default.createElement('br', null),
                  'All'
                ),
                _react2.default.createElement(_semanticUiReact.Icon, { name: 'dropdown' })
              ),
              _react2.default.createElement(
                _semanticUiReact.Menu.Item,
                { fitted: 'vertically' },
                _react2.default.createElement(
                  'div',
                  null,
                  _react2.default.createElement(
                    'small',
                    null,
                    'Date'
                  ),
                  _react2.default.createElement('br', null),
                  '16 Sep 2017 - 22 Sep 2017'
                ),
                _react2.default.createElement(_semanticUiReact.Icon, { name: 'dropdown' })
              )
            )
          ),
          _react2.default.createElement(_semanticUiReact.Divider, null),
          _react2.default.createElement(
            _semanticUiReact.Grid,
            null,
            _react2.default.createElement(
              _semanticUiReact.Grid.Row,
              null,
              _react2.default.createElement(
                _semanticUiReact.Grid.Column,
                { width: 3 },
                _react2.default.createElement(_semanticUiReact.Image, { fluid: true, shape: 'rounded', src: 'https://i1.sndcdn.com/artworks-000205720468-8rbpnk-t500x500.jpg' })
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
                      '25-27 of August 2017'
                    ),
                    _react2.default.createElement('br', null),
                    'EUROPE 2.0',
                    _react2.default.createElement('br', null),
                    'THE FUTURE BEGINS NOW',
                    _react2.default.createElement(
                      _semanticUiReact.Header.Subheader,
                      null,
                      'Bonn Area, Germany'
                    )
                  )
                ),
                _react2.default.createElement(
                  'p',
                  null,
                  'A series of conversations with Rabbi Dr. Michael Laitman, whose purpose is to create the infrastructure to promote every person, organization, society or country, to better understand the reality of our lives and to achieve a good life'
                )
              )
            ),
            _react2.default.createElement(
              _semanticUiReact.Grid.Row,
              null,
              _react2.default.createElement(
                _semanticUiReact.Grid.Column,
                null,
                _react2.default.createElement(_semanticUiReact.Embed, {
                  active: true,
                  aspectRatio: '21:9',
                  iframe: {
                    allowFullScreen: false,
                    style: {
                      border: 0
                    },
                    frameborder: "0"
                  },
                  placeholder: '/assets/images/image-16by9.png',
                  url: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d80860.06794871506!2d7.04726036282409!3d50.703664739362665!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47bee19f7ccbda49%3A0x86dbf8c6685c9617!2sBonn%2C+Germany!5e0!3m2!1sen!2sil!4v1503539041101'
                })
              )
            )
          ),
          _react2.default.createElement(
            _semanticUiReact.Header,
            { size: 'large', color: 'pink', inverted: true },
            'Programs Collection'
          ),
          _react2.default.createElement(_semanticUiReact.Divider, null),
          _react2.default.createElement(
            _semanticUiReact.Grid,
            null,
            _react2.default.createElement(
              _semanticUiReact.Grid.Row,
              null,
              _react2.default.createElement(
                _semanticUiReact.Grid.Column,
                { width: 3 },
                _react2.default.createElement(_semanticUiReact.Image, { fluid: true, shape: 'rounded', src: 'http://www.kab.co.il/images/attachments/91/276191_medium.jpg' })
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
                    'A New Life',
                    _react2.default.createElement(
                      _semanticUiReact.Header.Subheader,
                      null,
                      '920 Episodes'
                    )
                  )
                ),
                _react2.default.createElement(
                  'p',
                  null,
                  'A series of conversations with Rabbi Dr. Michael Laitman, whose purpose is to create the infrastructure to promote every person, organization, society or country, to better understand the reality of our lives and to achieve a good life'
                )
              )
            )
          ),
          _react2.default.createElement(
            _semanticUiReact.Header,
            { size: 'large', color: 'pink', inverted: true },
            'TV & Video Programs'
          ),
          _react2.default.createElement(_semanticUiReact.Divider, null),
          _react2.default.createElement(
            'div',
            { className: 'featured-unit' },
            _react2.default.createElement(_semanticUiReact.Header, {
              as: 'h2',
              content: 'Programs'
            }),
            _react2.default.createElement(
              _semanticUiReact.Card.Group,
              { itemsPerRow: '4', doubling: true },
              _react2.default.createElement(
                _semanticUiReact.Card,
                { href: '#' },
                _react2.default.createElement(_semanticUiReact.Image, { fluid: true, src: 'http://www.kab.co.il/images/attachments/91/276191_medium.jpg' }),
                _react2.default.createElement(
                  _semanticUiReact.Card.Content,
                  null,
                  _react2.default.createElement(
                    _semanticUiReact.Card.Header,
                    null,
                    'A New Life'
                  ),
                  _react2.default.createElement(
                    _semanticUiReact.Card.Meta,
                    null,
                    _react2.default.createElement(
                      'span',
                      { className: 'date' },
                      'Last updated: 30/7/2017'
                    )
                  ),
                  _react2.default.createElement(
                    _semanticUiReact.Card.Description,
                    null,
                    'Episode 852 - Jewish Culture: Purity & Impurity, the Spiritual Root'
                  )
                )
              ),
              _react2.default.createElement(
                _semanticUiReact.Card,
                { href: '#' },
                _react2.default.createElement(_semanticUiReact.Image, { fluid: true, src: 'http://www.kab.co.il/images/attachments/86/276186_medium.png' }),
                _react2.default.createElement(
                  _semanticUiReact.Card.Content,
                  null,
                  _react2.default.createElement(
                    _semanticUiReact.Card.Header,
                    null,
                    'Matthew'
                  ),
                  _react2.default.createElement(
                    _semanticUiReact.Card.Meta,
                    null,
                    _react2.default.createElement(
                      'span',
                      { className: 'date' },
                      'Joined in 2015'
                    )
                  ),
                  _react2.default.createElement(
                    _semanticUiReact.Card.Description,
                    null,
                    'Matthew is a musician living in Nashville.'
                  )
                )
              ),
              _react2.default.createElement(
                _semanticUiReact.Card,
                { href: '#' },
                _react2.default.createElement(_semanticUiReact.Image, { fluid: true, src: 'http://www.kab.co.il/images/attachments/37/269137_medium.jpg' }),
                _react2.default.createElement(
                  _semanticUiReact.Card.Content,
                  null,
                  _react2.default.createElement(
                    _semanticUiReact.Card.Header,
                    null,
                    'Matthew'
                  ),
                  _react2.default.createElement(
                    _semanticUiReact.Card.Meta,
                    null,
                    _react2.default.createElement(
                      'span',
                      { className: 'date' },
                      'Joined in 2015'
                    )
                  ),
                  _react2.default.createElement(
                    _semanticUiReact.Card.Description,
                    null,
                    'Matthew is a musician living in Nashville.'
                  )
                )
              ),
              _react2.default.createElement(
                _semanticUiReact.Card,
                { href: '#' },
                _react2.default.createElement(_semanticUiReact.Image, { fluid: true, src: 'http://www.kab.co.il/images/attachments/21/209721_medium.jpg' }),
                _react2.default.createElement(
                  _semanticUiReact.Card.Content,
                  null,
                  _react2.default.createElement(
                    _semanticUiReact.Card.Header,
                    null,
                    'Matthew'
                  ),
                  _react2.default.createElement(
                    _semanticUiReact.Card.Meta,
                    null,
                    _react2.default.createElement(
                      'span',
                      { className: 'date' },
                      'Joined in 2015'
                    )
                  ),
                  _react2.default.createElement(
                    _semanticUiReact.Card.Description,
                    null,
                    'Matthew is a musician living in Nashville.'
                  )
                )
              )
            )
          ),
          _react2.default.createElement(
            _semanticUiReact.Menu,
            { secondary: true, pointing: true, color: 'blue', className: 'index-filters', size: 'large' },
            _react2.default.createElement(
              _semanticUiReact.Menu.Item,
              { header: true },
              'Filter Programs by:'
            ),
            _react2.default.createElement(
              _semanticUiReact.Menu.Item,
              { active: true },
              'Date'
            ),
            _react2.default.createElement(
              _semanticUiReact.Menu.Item,
              null,
              'Genre / Program'
            ),
            _react2.default.createElement(
              _semanticUiReact.Menu.Item,
              null,
              'Topic'
            ),
            _react2.default.createElement(
              _semanticUiReact.Menu.Item,
              { className: 'index-filters__search' },
              _react2.default.createElement(_semanticUiReact.Search, { category: true, results: results, size: 'mini', placeholder: 'Search Programs...', categoryRenderer: categoryRenderer, resultRenderer: resultRenderer })
            )
          ),
          _react2.default.createElement(
            _semanticUiReact.Header,
            { size: 'large', color: 'pink', inverted: true },
            'video collection \u263C.\u263C'
          ),
          _react2.default.createElement(
            _semanticUiReact.Grid,
            null,
            _react2.default.createElement(
              _semanticUiReact.Grid.Row,
              { className: 'video_box' },
              _react2.default.createElement(
                _semanticUiReact.Grid.Column,
                { width: '10' },
                _react2.default.createElement(
                  'div',
                  { className: 'video_player' },
                  _react2.default.createElement('div', { className: 'video_placeholder' })
                )
              ),
              _react2.default.createElement(
                _semanticUiReact.Grid.Column,
                { className: 'player_panel', width: '6' },
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
                        _semanticUiReact.Button.Group,
                        { fluid: true },
                        _react2.default.createElement(
                          _semanticUiReact.Button,
                          { active: true, color: 'blue' },
                          'Video'
                        ),
                        _react2.default.createElement(
                          _semanticUiReact.Button,
                          null,
                          'Audio'
                        )
                      )
                    ),
                    _react2.default.createElement(
                      _semanticUiReact.Grid.Column,
                      null,
                      _react2.default.createElement(_semanticUiReact.Dropdown, { fluid: true, placeholder: 'Language', search: true, selection: true, options: [{ key: 'EN', value: 'EN', text: 'English' }, { key: 'HE', value: 'HE', text: 'Hebrew' }, { key: 'RU', value: 'RU', text: 'Russian' }] })
                    )
                  )
                ),
                _react2.default.createElement(_semanticUiReact.Divider, null),
                _react2.default.createElement(
                  _semanticUiReact.Header,
                  { as: 'h3' },
                  _react2.default.createElement(
                    _semanticUiReact.Header.Content,
                    null,
                    'Morning Lesson - 2/4',
                    _react2.default.createElement(
                      _semanticUiReact.Header.Subheader,
                      null,
                      '2016-10-26'
                    )
                  )
                ),
                _react2.default.createElement(
                  _semanticUiReact.Menu,
                  { vertical: true, fluid: true, size: 'small', color: 'blue' },
                  _react2.default.createElement(
                    _semanticUiReact.Menu.Item,
                    { as: 'a' },
                    '1 - Lesson preparation - 00:12:02'
                  ),
                  _react2.default.createElement(
                    _semanticUiReact.Menu.Item,
                    { as: 'a', active: true },
                    '2 - Lesson on the topic of "Brit (Union)" - 01:29:00'
                  ),
                  _react2.default.createElement(
                    _semanticUiReact.Menu.Item,
                    { as: 'a', disabled: true },
                    '3 - Baal HaSulam, TES, part 8, item 20 - 00:31:54'
                  ),
                  _react2.default.createElement(
                    _semanticUiReact.Menu.Item,
                    { as: 'a' },
                    '4 - Baal HaSulam, "The Giving of the Torah", item 6 - 00:43:41'
                  )
                )
              )
            )
          ),
          _react2.default.createElement(
            _semanticUiReact.Header,
            { size: 'large', color: 'pink', inverted: true },
            'tags -^+^-'
          ),
          _react2.default.createElement(
            _semanticUiReact.Grid,
            null,
            _react2.default.createElement(
              _semanticUiReact.Grid.Row,
              null,
              _react2.default.createElement(
                _semanticUiReact.Grid.Column,
                null,
                _react2.default.createElement(
                  'div',
                  { className: 'filter-tags' },
                  _react2.default.createElement(
                    _semanticUiReact.Button.Group,
                    { size: 'mini' },
                    _react2.default.createElement(
                      _semanticUiReact.Button,
                      { basic: true, color: 'blue' },
                      _react2.default.createElement(_semanticUiReact.Icon, { name: 'book' }),
                      'Baal HaSulam - TES'
                    ),
                    _react2.default.createElement(_semanticUiReact.Button, { color: 'blue', icon: 'close' })
                  ),
                  _react2.default.createElement(
                    _semanticUiReact.Button.Group,
                    { size: 'mini' },
                    _react2.default.createElement(
                      _semanticUiReact.Button,
                      { basic: true, color: 'blue' },
                      _react2.default.createElement(_semanticUiReact.Icon, { name: 'tag' }),
                      'Arvut Between the Tens'
                    ),
                    _react2.default.createElement(_semanticUiReact.Button, { color: 'blue', icon: 'close' })
                  ),
                  _react2.default.createElement(
                    _semanticUiReact.Button.Group,
                    { size: 'mini' },
                    _react2.default.createElement(
                      _semanticUiReact.Button,
                      { basic: true, color: 'blue' },
                      _react2.default.createElement(_semanticUiReact.Icon, { name: 'calendar' }),
                      '3 Jul 2017 - 3 Jul 2017'
                    ),
                    _react2.default.createElement(_semanticUiReact.Button, { color: 'blue', icon: 'close' })
                  )
                )
              )
            )
          ),
          _react2.default.createElement(
            _semanticUiReact.Header,
            { size: 'large', color: 'pink', inverted: true },
            'pagination (\xB0\u0296\xB0)'
          ),
          _react2.default.createElement(
            _semanticUiReact.Grid,
            null,
            _react2.default.createElement(
              _semanticUiReact.Grid.Row,
              null,
              _react2.default.createElement(
                _semanticUiReact.Grid.Column,
                { textAlign: 'center' },
                _react2.default.createElement(
                  _semanticUiReact.Menu,
                  { pagination: true, color: 'blue' },
                  _react2.default.createElement(
                    _semanticUiReact.Menu.Item,
                    { icon: true },
                    _react2.default.createElement(_semanticUiReact.Icon, { name: 'angle double left' })
                  ),
                  _react2.default.createElement(
                    _semanticUiReact.Menu.Item,
                    { icon: true },
                    _react2.default.createElement(_semanticUiReact.Icon, { name: 'angle left' })
                  ),
                  _react2.default.createElement(
                    _semanticUiReact.Menu.Item,
                    { icon: true, disabled: true },
                    _react2.default.createElement(_semanticUiReact.Icon, { name: 'ellipsis horizontal' })
                  ),
                  _react2.default.createElement(_semanticUiReact.Menu.Item, { name: '2' }),
                  _react2.default.createElement(_semanticUiReact.Menu.Item, { name: '3' }),
                  _react2.default.createElement(_semanticUiReact.Menu.Item, { name: '4' }),
                  _react2.default.createElement(_semanticUiReact.Menu.Item, { name: '5' }),
                  _react2.default.createElement(_semanticUiReact.Menu.Item, { active: true, name: '6' }),
                  _react2.default.createElement(_semanticUiReact.Menu.Item, { name: '7' }),
                  _react2.default.createElement(_semanticUiReact.Menu.Item, { name: '8' }),
                  _react2.default.createElement(_semanticUiReact.Menu.Item, { name: '9' }),
                  _react2.default.createElement(_semanticUiReact.Menu.Item, { name: '10' }),
                  _react2.default.createElement(
                    _semanticUiReact.Menu.Item,
                    { icon: true, disabled: true },
                    _react2.default.createElement(_semanticUiReact.Icon, { name: 'ellipsis horizontal' })
                  ),
                  _react2.default.createElement(
                    _semanticUiReact.Menu.Item,
                    { icon: true },
                    _react2.default.createElement(_semanticUiReact.Icon, { name: 'angle right' })
                  ),
                  _react2.default.createElement(
                    _semanticUiReact.Menu.Item,
                    { icon: true },
                    _react2.default.createElement(_semanticUiReact.Icon, { name: 'angle double right' })
                  )
                )
              )
            )
          )
        )
      );
    }
  }]);

  return Design;
}(_react.Component);

exports.default = Design;
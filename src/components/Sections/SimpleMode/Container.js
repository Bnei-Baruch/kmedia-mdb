import React, { Component } from 'react';
import { List, Table } from 'semantic-ui-react';

import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import moment from 'moment';
import groupBy from 'lodash/groupBy';

import { selectors as settings } from '../../../redux/modules/settings';
import { actions, selectors } from '../../../redux/modules/simpelMode';
import * as shapes from '../../shapes';
import Page from './Page';
import { translate } from 'react-i18next';
import {
  CT_ARTICLE,
  CT_DAILY_LESSON,
  CT_FULL_LESSON,
  CT_LESSON_PART,
  CT_VIDEO_PROGRAM_CHAPTER,
  NO_NAME,
  VS_NAMES
} from '../../../helpers/consts';
import Link from '../../Language/MultiLanguageLink';
import { CollectionsBreakdown } from '../../../helpers/mdb';
import { canonicalLink } from '../../../helpers/links';

const CT_DAILY_LESSON_I18N_KEY = `constants.content-types.${CT_DAILY_LESSON}`;

export const renderUnit = (unit, t) => {
  const breakdown = new CollectionsBreakdown(Object.values(unit.collections || {}));

  const relatedItems = breakdown.getDailyLessons().map(x =>
    (
      <List.Item key={x.id} as={Link} to={canonicalLink(x)}>
        {t(CT_DAILY_LESSON_I18N_KEY)} {t('values.date', { date: x.film_date })}
      </List.Item>
    )
  ).concat(breakdown.getAllButDailyLessons().map(x => (
    <List.Item key={x.id} as={Link} to={canonicalLink(x)}>
      {x.name || NO_NAME}
    </List.Item>
  )));

  return (
    <Table.Row verticalAlign="top" key={unit.id} className="no-thumbnail">
      <Table.Cell collapsing singleLine>
        <span className="index__date">{t('values.date', { date: unit.film_date })}</span>
      </Table.Cell>
      <Table.Cell>
        <Link className="index__title" to={canonicalLink(unit)}>
          {unit.name || NO_NAME}
        </Link>
        {
          relatedItems.length === 0 ?
            null :
            (
              <List horizontal divided link className="index__collections" size="tiny">
                <List.Item>
                  <List.Header>
                    {t('lessons.list.related')}:
                  </List.Header>
                </List.Item>
                {relatedItems}
              </List>
            )
        }
      </Table.Cell>
    </Table.Row>
  );
};

export const renderCollection = (collection, language, t) => {
  let units = [];
  if (collection.content_units) {
    units = collection.content_units.map((unit) => {
      const breakdown = new CollectionsBreakdown(Object.values(unit.collections || {}));

      const relatedItems = breakdown.getAllButDailyLessons().map(x => (
        <List.Item key={x.id} as={Link} to={canonicalLink(x)}>
          {x.name || NO_NAME}
        </List.Item>
      ));

      return (
        <Table.Row key={`u-${unit.id}`} verticalAlign="top" className="no-thumbnail">
          <Table.Cell>
            <Link className="index__item" to={canonicalLink(unit)}>
              {unit.name || NO_NAME}
            </Link>
          </Table.Cell>
        </Table.Row>
      );
    });
  }

  const rows = [];

  rows.push((
    <Table.Row key={`l-${collection.id}`} verticalAlign="top" className="no-thumbnail">
      <Table.Cell>
        <Link className="index__title" to={canonicalLink(collection)}>
          {`${t(CT_DAILY_LESSON_I18N_KEY)}${collection.number ? ` ${t('lessons.list.number')}${collection.number}` : ''}`}
        </Link>
      </Table.Cell>
    </Table.Row>
  ));

  return rows.concat(units);
};

const groupOtherMediaByType = (collection, language, t) => {
  const cdnUrl             = process.env.REACT_APP_CDN_URL;
  const contentTypesObject = groupBy(collection, 'content_type');
  let rows                 = [];
  let files                = [];

  const linkStyle = {
    fontWeight: 'normal',
    color: 'rgba(0,0,0,.87) !important'
  };

  const getI18nTypeOverridesKey = (contentType) => {
    switch (contentType) {
    case CT_LESSON_PART:
    case CT_FULL_LESSON:
      return 'lesson.';
    case CT_VIDEO_PROGRAM_CHAPTER:
      return 'program.';
    case CT_ARTICLE:
      return 'publication.';
    default:
      return '';
    }
  };

  Object.keys(contentTypesObject).forEach((type) => {

    contentTypesObject[type].forEach((unit) => {
      files = [];
      unit.files.filter(file => file.language === language).forEach((file) => {
        const typeOverrides = getI18nTypeOverridesKey(unit.content_type);
        const url           = cdnUrl + file.id;
        const baseLabel     = t(`media-downloads.${typeOverrides}type-labels.${file.type}`);
        let label           = baseLabel;
        if (file.video_size) {
          label = `${label} [${VS_NAMES[file.video_size]}]`;
        }
        let icon;

        switch (file.type) {
        case 'video':
          icon = 'video play';
          break;

        case 'audio':
          icon = 'volume up';
          break;

        default:
          icon = 'file alternate';
        }

        files.push((
          <List.Item key={`f-${file.id}`} className="media-file-button">
            <List.Icon name={icon} />
            <List.Content>
              <List.Header href={url} className="media-file-link" style={linkStyle}>{label}</List.Header>
            </List.Content>
          </List.Item>
        ));
      });

      rows.push((
        <List.Item key={`t-${unit.id}`} className="no-thumbnail">
          <List.Header className="unit-header">
            <span>{unit.name}</span>
          </List.Header>
          <List.List className="horizontal-list">
            {files}
          </List.List>
        </List.Item>
      ));
    });
  });

  return rows;
};

export const renderUnitOrCollection = (item, language, t) => (
  item.content_units ? renderCollection(item, language, t) : groupOtherMediaByType(item, language, t)

);

class SimpleModeContainer extends Component {
  static propTypes = {
    location: shapes.HistoryLocation.isRequired,
    items: PropTypes.objectOf(shapes.SimpleMode),
    wip: shapes.WIP,
    err: shapes.Error,
    language: PropTypes.string.isRequired,
    t: PropTypes.func.isRequired,
    fetchAllMedia: PropTypes.func.isRequired,
  };

  static defaultProps = {
    items: {},
    wip: false,
    err: null,
  };

  constructor() {
    super();
    this.handlePageChanged = this.handlePageChanged.bind(this);
    this.state             = {
      date: new Date(),
      language: '',
    };
  }

  componentWillMount() {
    if (!this.state.language) {
      const { language } = this.props;
      this.setState({ language });
    }
  }

  componentDidMount() {
    const date         = moment(this.state.date).format('YYYY-MM-DD');
    const { language } = this.state;
    this.props.fetchAllMedia({ date, language });
  }

  componentWillReceiveProps(nextProps) {
    if (!this.state.language) {
      const { language } = nextProps;
      this.setState({ language });
    }
  }

  // eslint-disable-next-line class-methods-use-this
  extraFetchParams(props) {
  }

  handlePageChanged(pageNo) {
    window.scrollTo(0, 0);
  }

  handleLanguageChanged = (e, language) => {
    this.setState({ language });

    const date = moment(this.state.date).format('YYYY-MM-DD');
    this.props.fetchAllMedia({ date, language });
  };

  handleDayClick = (selectedDate) => {
    this.setState({ date: selectedDate });

    const date         = moment(selectedDate).format('YYYY-MM-DD');
    const { language } = this.state;
    this.props.fetchAllMedia({ date, language });
  };

  render() {
    const { items, wip, err, t, location } = this.props;
    const { language }                     = this.state;

    return (
      <Page
        items={items}
        selectedDate={this.state.date}
        wip={wip}
        err={err}
        language={language}
        t={t}
        location={location}
        renderUnit={renderUnitOrCollection}
        onPageChange={this.handlePageChanged}
        onDayClick={this.handleDayClick}
        onLanguageChange={this.handleLanguageChanged}
      />
    );
  }
}

export const mapState = state => ({
  items: selectors.getAllMedia(state.simpleMode),
  wip: selectors.getWip(state.simpleMode),
  err: selectors.getErrors(state.simpleMode),
  language: settings.getLanguage(state.settings)
});

export const mapDispatch = dispatch => (
  bindActionCreators({
    fetchAllMedia: actions.fetchAllMediaForDate,
  }, dispatch)
);

export default withRouter(connect(mapState, mapDispatch)(translate()(SimpleModeContainer)));

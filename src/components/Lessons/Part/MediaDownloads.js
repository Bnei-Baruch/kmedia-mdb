import React, { Component } from 'react';
import PropTypes from 'prop-types';
import CopyToClipboard from 'react-copy-to-clipboard';
import { Button, Grid, Header, Table } from 'semantic-ui-react';

import { CT_KITEI_MAKOR, MT_AUDIO, MT_IMAGE, MT_TEXT, MT_VIDEO } from '../../../helpers/consts';
import { physicalFile } from '../../../helpers/utils';
import * as shapes from '../../shapes';
import LanguageSelector from '../../shared/LanguageSelector';

const MEDIA_ORDER = [
  MT_VIDEO,
  MT_AUDIO,
  MT_TEXT,
  MT_IMAGE,
];

class MediaDownloads extends Component {

  static propTypes = {
    language: PropTypes.string.isRequired,
    lesson: shapes.LessonPart,
    t: PropTypes.func.isRequired,
  };

  static defaultProps = {
    lesson: undefined,
  };

  constructor(props) {
    super(props);
    this.state = this.getInitialState(props);
  }

  getInitialState = (props) => {
    const { lesson = {} } = props;
    const groups          = this.getFilesByLanguage(lesson.files);
    const derivedGroups   = this.getDerivedFilesByContentType(lesson.derived_units);

    let language = props.language;
    if (!groups.has(language)) {
      language = groups.keys().next().value;
    }

    return { groups, language, derivedGroups };
  };

  componentWillReceiveProps(nextProps) {
    const { lesson, language } = nextProps;
    const props                = this.props;
    const state                = this.state;

    // no change
    if (lesson === props.lesson && language === props.language) {
      return;
    }

    // only language changed
    if (lesson === props.lesson && language !== props.language) {
      if (state.groups.has(language)) {
        this.setState({ language });
        return;
      }
    }

    // lesson changed, maybe language as well
    const groups = this.getFilesByLanguage(lesson.files);
    let lang;
    if (groups.has(language)) {
      lang = language;
    } else if (groups.has(state.language)) {
      lang = state.language;
    } else {
      lang = groups.keys().next().value;
    }

    let derivedGroups = state.derivedGroups;
    if (lesson.derived_units !== props.lesson.derived_units) {
      derivedGroups = this.getDerivedFilesByContentType(lesson.derived_units);
    }

    this.setState({
      groups,
      language: lang,
      derivedGroups,
    });
  }

  getFilesByLanguage = (files) => {
    const groups = new Map();

    (files || []).forEach((file) => {
      if (!groups.has(file.language)) {
        groups.set(file.language, new Map());
      }

      const byType = groups.get(file.language);
      if (!byType.has(file.type)) {
        byType.set(file.type, []);
      }
      byType.get(file.type).push(file);
    });

    // sort file lists by size
    groups.forEach(byType => byType.forEach(v => v.sort((a, b) => a.size - b.size)));

    return groups;
  };

  getDerivedFilesByContentType = units => (
    Object.values(units || {})
      .reduce((acc, val) => {
        acc[val.content_type] = this.getFilesByLanguage(val.files);
        return acc;
      }, {})
  );

  handleChangeLanguage = (e, language) => {
    this.setState({ language });
  };

  renderRow = (file, label, t) => {
    const ext = file.name.substring(file.name.lastIndexOf('.') + 1);
    const url = physicalFile(file);

    return (
      <Table.Row key={file.id} verticalAlign="top">
        <Table.Cell>
          {label}
        </Table.Cell>
        <Table.Cell collapsing>
          <Button
            compact
            fluid
            as="a"
            href={url}
            target="_blank"
            size="mini"
            color="orange"
            content={ext.toUpperCase()}
          />
        </Table.Cell>
        <Table.Cell collapsing>
          <CopyToClipboard text={url}>
            <Button
              compact
              fluid
              size="mini"
              color="orange"
              content={t('lessons.part.downloads.copy-link')}
            />
          </CopyToClipboard>
        </Table.Cell>
      </Table.Row>
    );
  };

  render() {
    const { t }                               = this.props;
    const { language, groups, derivedGroups } = this.state;
    const byType                              = groups.get(language) || new Map();
    const kiteiMakor                          = derivedGroups[CT_KITEI_MAKOR];
    const kiteiMakorByType                    = (kiteiMakor && kiteiMakor.get(language)) || new Map();

    let rows;
    if (byType.size === 0) {
      rows = [
        <Table.Row key="0">
          <Table.Cell>{t('messages.no-files')}</Table.Cell>
        </Table.Row>
      ];
    } else {
      rows = MEDIA_ORDER.reduce((acc, val) => {
        const label = t(`lessons.part.downloads.type-labels.${val}`);
        const files = (byType.get(val) || []).map(file => this.renderRow(file, label, t));
        return acc.concat(files);
      }, []);
    }

    let derivedRows;
    if (kiteiMakorByType.size > 0) {
      derivedRows = MEDIA_ORDER.reduce((acc, val) => {
        const label = `${t('constants.content-types.KITEI_MAKOR')} - ${t(`constants.media-types.${val}`)}`;
        const files = (kiteiMakorByType.get(val) || []).map(file => this.renderRow(file, label, t));
        return acc.concat(files);
      }, []);
    }

    return (
      <div>
        <Grid columns="equal">
          <Grid.Row>
            <Grid.Column>
              <Header as="h3" content={t('lessons.part.downloads.title')} />
            </Grid.Column>
            <Grid.Column>
              <LanguageSelector
                languages={Array.from(groups.keys())}
                defaultValue={language}
                onSelect={this.handleChangeLanguage}
              />
            </Grid.Column>
          </Grid.Row>
        </Grid>
        <Table basic="very" compact="very">
          <Table.Body>
            {rows}
          </Table.Body>
        </Table>
        {
          derivedRows ?
            <div>
              <Header size="tiny" content={t('lessons.part.downloads.derived-title')} />
              <Table basic="very" compact="very">
                <Table.Body>
                  {derivedRows}
                </Table.Body>
              </Table>
            </div>
            : null
        }
      </div>
    );
  }
}

export default MediaDownloads;

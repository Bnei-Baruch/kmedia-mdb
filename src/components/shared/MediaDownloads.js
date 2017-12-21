import React, { Component } from 'react';
import PropTypes from 'prop-types';
import CopyToClipboard from 'react-copy-to-clipboard';
import { Button, Grid, Header, Table } from 'semantic-ui-react';

import {
  CT_FULL_LESSON,
  CT_KITEI_MAKOR,
  CT_LESSON_PART,
  CT_VIDEO_PROGRAM_CHAPTER,
  MT_AUDIO,
  MT_IMAGE,
  MT_TEXT,
  MT_VIDEO
} from '../../helpers/consts';
import { physicalFile } from '../../helpers/utils';
import * as shapes from '../shapes';
import DropdownLanguageSelector from '../Language/Selector/DropdownLanguageSelector';

const MEDIA_ORDER = [
  MT_VIDEO,
  MT_AUDIO,
  MT_TEXT,
  MT_IMAGE,
];

class MediaDownloads extends Component {

  static propTypes = {
    language: PropTypes.string.isRequired,
    unit: shapes.ContentUnit,
    t: PropTypes.func.isRequired,
  };

  static defaultProps = {
    unit: undefined,
  };

  constructor(props) {
    super(props);
    this.state = this.getInitialState(props);
  }

  getInitialState = (props) => {
    const { unit = {} } = props;
    const groups        = this.getFilesByLanguage(unit.files);
    const derivedGroups = this.getDerivedFilesByContentType(unit.derived_units);

    let language = props.language;
    if (!groups.has(language)) {
      language = groups.keys().next().value;
    }

    return { groups, language, derivedGroups };
  };

  componentWillReceiveProps(nextProps) {
    const { unit, language } = nextProps;
    const props              = this.props;
    const state              = this.state;

    // no change
    if (unit === props.unit && language === props.language) {
      return;
    }

    // only language changed
    if (unit === props.unit && language !== props.language) {
      if (state.groups.has(language)) {
        this.setState({ language });
        return;
      }
    }

    // unit changed, maybe language as well
    const groups = this.getFilesByLanguage(unit.files);
    let lang;
    if (groups.has(language)) {
      lang = language;
    } else if (groups.has(state.language)) {
      lang = state.language;
    } else {
      lang = groups.keys().next().value;
    }

    let derivedGroups = state.derivedGroups;
    if (unit.derived_units !== props.unit.derived_units) {
      derivedGroups = this.getDerivedFilesByContentType(unit.derived_units);
    }

    this.setState({
      groups,
      language: lang,
      derivedGroups,
    });
  }

  // TODO: implement once fallback language is known
  fallbackImages = (images, language) => images[0];

  getFilesByLanguage = (files) => {
    const groups = new Map();

    // keep track of image files. These are a special case.
    // Images, unlike other types, are language agnostic by nature.
    // However, since they might contain text in them we do have language attached to such files.
    // For other languages, whom don't have a dedicated translation of these images
    // we give them the images of their fallback language.
    let images = [];

    (files || []).forEach((file) => {
      if (!groups.has(file.language)) {
        groups.set(file.language, new Map());
      }

      const byType = groups.get(file.language);
      if (!byType.has(file.type)) {
        byType.set(file.type, []);
      }
      byType.get(file.type).push(file);

      if (file.type === MT_IMAGE) {
        images.push(file);
      }
    });

    // sort file lists by size
    groups.forEach(byType => byType.forEach(v => v.sort((a, b) => a.size - b.size)));

    // fill in images fallback into every language
    if (images.length > 0) {
      groups.forEach((byType, language) => {
        if (!byType.has(MT_IMAGE)) {
          byType.set(MT_IMAGE, [this.fallbackImages(images, language)]);
        }
      });
    }

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
              content={t('buttons.copy-link')}
            />
          </CopyToClipboard>
        </Table.Cell>
      </Table.Row>
    );
  };

  getI18nTypeOverridesKey = () => {
    switch (this.props.unit.content_type) {
    case CT_LESSON_PART:
    case CT_FULL_LESSON:
      return 'lesson';
    case CT_VIDEO_PROGRAM_CHAPTER:
      return 'program';
    default:
      return '';
    }
  };

  render() {
    const { t }                               = this.props;
    const { language, groups, derivedGroups } = this.state;
    const byType                              = groups.get(language) || new Map();
    const kiteiMakor                          = derivedGroups[CT_KITEI_MAKOR];
    const kiteiMakorByType                    = (kiteiMakor && kiteiMakor.get(language)) || new Map();

    let typeOverrides = this.getI18nTypeOverridesKey();
    if (typeOverrides) {
      typeOverrides += '.';
    }

    let rows;
    if (byType.size === 0) {
      rows = [
        <Table.Row key="0">
          <Table.Cell>{t('messages.no-files')}</Table.Cell>
        </Table.Row>
      ];
    } else {
      rows = MEDIA_ORDER.reduce((acc, val) => {
        const label = t(`media-downloads.${typeOverrides}type-labels.${val}`);
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
      <div className='content__aside-unit'>
        <Grid columns="equal">
          <Grid.Row>
            <Grid.Column>
              <Header as="h3" content={t('media-downloads.title')} />
            </Grid.Column>
            <Grid.Column>
              <DropdownLanguageSelector
                languages={Array.from(groups.keys())}
                defaultValue={language}
                onSelect={this.handleChangeLanguage}
              />
            </Grid.Column>
          </Grid.Row>
        </Grid>
        <Table basic="very" compact="very" unstackable>
          <Table.Body>
            {rows}
          </Table.Body>
        </Table>
        {
          derivedRows ?
            <div>
              <Header size="tiny" content={t('media-downloads.derived-title')} />
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

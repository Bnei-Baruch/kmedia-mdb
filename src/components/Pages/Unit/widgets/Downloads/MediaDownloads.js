import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withNamespaces } from 'react-i18next';
import { connect } from 'react-redux';
import CopyToClipboard from 'react-copy-to-clipboard';
import { Button, Grid, Header, Table, Popup } from 'semantic-ui-react';
import isEqual from 'react-fast-compare';

import { CT_ARTICLE, CT_FULL_LESSON, CT_KITEI_MAKOR, CT_LELO_MIKUD, CT_LESSON_PART, CT_PUBLICATION, CT_RESEARCH_MATERIAL, CT_VIDEO_PROGRAM_CHAPTER, MT_AUDIO, MT_IMAGE, MT_TEXT, MT_VIDEO, VS_NAMES } from '../../../../../helpers/consts';
import { selectSuitableLanguage } from '../../../../../helpers/language';
import { physicalFile } from '../../../../../helpers/utils';
import { selectors as settings } from '../../../../../redux/modules/settings';
import { selectors } from '../../../../../redux/modules/publications';
import * as shapes from '../../../../shapes';
import DropdownLanguageSelector from '../../../../Language/Selector/DropdownLanguageSelector';

const MEDIA_ORDER = [
  MT_VIDEO,
  MT_AUDIO,
  MT_TEXT,
  MT_IMAGE,
];

const POPOVER_CONFIRMATION_TIMEOUT = 2500;

class MediaDownloads extends Component {
  static propTypes = {
    unit: shapes.ContentUnit,
    publisherById: PropTypes.objectOf(shapes.Publisher).isRequired,
    language: PropTypes.string.isRequired,
    contentLanguage: PropTypes.string.isRequired,
    t: PropTypes.func.isRequired,
  };

  static defaultProps = {
    unit: undefined,
  };

  timeout = {};

  constructor(props) {
    super(props);
    this.state = this.getInitialState(props);
  }

  getInitialState = (props) => {
    const { unit = {}, contentLanguage, language: uiLanguage } = props;
    const groups                                               = this.getFilesByLanguage(unit.files);
    const derivedGroups                                        = this.getDerivedFilesByContentType(unit.derived_units);

    const languages = [...groups.keys()];
    const language  = selectSuitableLanguage(contentLanguage, uiLanguage, languages);

    const isCopyPopupOpen = {};

    return { groups, derivedGroups, languages, language, isCopyPopupOpen };
  };

  componentWillReceiveProps(nextProps) {
    const { unit, contentLanguage, language: uiLanguage } = nextProps;
    const { props, state }                                = this;

    // only language changed
    if (
      (uiLanguage !== props.language || contentLanguage !== props.contentLanguage)
      && isEqual(unit, props.unit)
    ) {
      const language = selectSuitableLanguage(contentLanguage, uiLanguage, state.languages);
      if (language !== state.language) {
        this.setState({ language });
        return;
      }
    }

    // unit changed, maybe language as well
    const groups    = this.getFilesByLanguage(unit.files);
    const languages = [...groups.keys()];
    const language  = selectSuitableLanguage(contentLanguage, uiLanguage, languages);

    let { derivedGroups } = state;
    if (!isEqual(unit.derived_units, props.unit.derived_units)) {
      derivedGroups = this.getDerivedFilesByContentType(unit.derived_units);
    }

    this.setState({ groups, derivedGroups, languages, language, });
  }

  shouldComponentUpdate(nextProps, nextState) {
    const { unit, contentLanguage, language: uiLanguage } = nextProps;
    const { props, state }                                = this;

    return !(
      state.language === nextState.language
      && uiLanguage === props.language
      && contentLanguage === props.contentLanguage
      && isEqual(unit, props.unit)
      && isEqual(state.isCopyPopupOpen, nextState.isCopyPopupOpen)
    );
  }

  getFilesByLanguage = (files = []) => {
    const groups = new Map();

    // keep track of image files. These are a special case.
    // Images, unlike other types, are language agnostic by nature.
    // However, since they might contain text in them we do have language attached to such files.
    // For other languages, whom don't have a dedicated translation of these images
    // we give them the images of their fallback language.
    const images = [];

    files.forEach((file) => {
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
      const fallbackImage = this.fallbackImage(images);
      groups.forEach((byType) => {
        if (!byType.has(MT_IMAGE)) {
          byType.set(MT_IMAGE, fallbackImage);
        }
      });
    }

    return groups;
  };

  getDerivedFilesByContentType = (units) => {
    const allByCT = Object.values(units || {})
      .reduce((acc, val) => {
        acc[val.content_type] = (acc[val.content_type] || []).concat((val.files || []).map(x => ({ ...x, cu: val })));
        return acc;
      }, {});

    return Object.entries(allByCT).reduce((acc, val) => {
      const [ct, files] = val;
      acc[ct]           = this.getFilesByLanguage(files);
      return acc;
    }, {});
  };

  getI18nTypeOverridesKey = () => {
    const { unit } = this.props;
    switch (unit.content_type) {
      case CT_LESSON_PART:
      case CT_FULL_LESSON:
        return 'lesson';
      case CT_VIDEO_PROGRAM_CHAPTER:
        return 'program';
      case CT_ARTICLE:
        return 'publication';
      default:
        return '';
    }
  };

  handleChangeLanguage = (e, language) => {
    this.setState({ language });
  };

  fallbackImage = (images) => {
    const imageLanguages                            = images.map(image => image.language);
    const { contentLanguage, language: uiLanguage } = this.props;
    const language                                  = selectSuitableLanguage(contentLanguage, uiLanguage, imageLanguages);

    return [images.find(image => image.language === language)];
  };
  handleCopied = (url) => {
    this.setState({ isCopyPopupOpen: {...this.state.isCopyPopupOpen, [url]: true} }, () => {
      setTimeout(() => this.setState({ isCopyPopupOpen: {...this.state.isCopyPopupOpen, [url]: false} } ), POPOVER_CONFIRMATION_TIMEOUT);
    });
  };

  renderRow = (file, label, t) => {
    const { isCopyPopupOpen } = this.state;
    const ext = file.name.substring(file.name.lastIndexOf('.') + 1);
    const url = physicalFile(file);

    return (
      <Table.Row key={file.id} className="media-downloads__file" verticalAlign="top">
        <Table.Cell>
          <span className="media-downloads__file-label">{label}</span>
        </Table.Cell>
        <Table.Cell collapsing>
          <Button
            compact
            fluid
            as="a"
            href={url}
            target="_blank"
            className="media-downloads__file-download-btn"
            size="mini"
            color="orange"
            content={ext.toUpperCase()}
          />
        </Table.Cell>
        <Table.Cell collapsing>
          <Popup
            open={!!isCopyPopupOpen[url]}
            content={t('messages.link-copied-to-clipboard')}
            position="bottom"
            trigger={(
              <CopyToClipboard text={url} onCopy={() => this.handleCopied(url)}>
                <Button
                  compact
                  fluid
                  className="media-downloads__file-copy-link-btn"
                  size="mini"
                  color="orange"
                  content={t('buttons.copy-link')}
                />
              </CopyToClipboard>
            )}
          />
        </Table.Cell>
      </Table.Row>
    );
  };

  render() {
    const { t, publisherById }                           = this.props;
    const { language, languages, groups, derivedGroups } = this.state;
    const byType                                         = groups.get(language) || new Map();
    const kiteiMakor                                     = derivedGroups[CT_KITEI_MAKOR];
    const kiteiMakorByType                               = (kiteiMakor && kiteiMakor.get(language)) || new Map();
    const leloMikud                                      = derivedGroups[CT_LELO_MIKUD];
    const leloMikudByType                                = (leloMikud && leloMikud.get(language)) || new Map();
    const publications                                   = derivedGroups[CT_PUBLICATION];
    const publicationsByType                             = (publications && publications.get(language)) || new Map();
    const articles                                       = derivedGroups[CT_ARTICLE];
    const articlesByType                                 = (articles && articles.get(language)) || new Map();
    const researchMaterials                              = derivedGroups[CT_RESEARCH_MATERIAL];
    const researchMaterialsByType                        = (researchMaterials && researchMaterials.get(language)) || new Map();

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
        const baseLabel = t(`media-downloads.${typeOverrides}type-labels.${val}`);
        const files     = (byType.get(val) || []).map((file) => {
          let label = baseLabel;
          if (file.video_size) {
            label = `${label} [${VS_NAMES[file.video_size]}]`;
          }
          return this.renderRow(file, label, t);
        });
        return acc.concat(files);
      }, []);
    }

    let derivedRows = [];
    if (kiteiMakorByType.size > 0) {
      derivedRows = MEDIA_ORDER.reduce((acc, val) => {
        const label = `${t('constants.content-types.KITEI_MAKOR')} - ${t(`constants.media-types.${val}`)}`;
        const files = (kiteiMakorByType.get(val) || []).map(file => this.renderRow(file, label, t));
        return acc.concat(files);
      }, derivedRows);
    }
    if (leloMikudByType.size > 0) {
      derivedRows = MEDIA_ORDER.reduce((acc, val) => {
        const label = `${t('constants.content-types.LELO_MIKUD')} - ${t(`constants.media-types.${val}`)}`;
        const files = (leloMikudByType.get(val) || []).map(file => this.renderRow(file, label, t));
        return acc.concat(files);
      }, derivedRows);
    }
    if (publicationsByType.size > 0) {
      derivedRows = MEDIA_ORDER.reduce((acc, val) => {
        const label = t(`media-downloads.${typeOverrides}type-labels.${val}`);
        const files = (publicationsByType.get(val) || []).map((file) => {
          const publisher = publisherById[file.cu.publishers[0]];
          return this.renderRow(file, `${label} - ${publisher ? publisher.name : '???'}`, t);
        });
        return acc.concat(files);
      }, derivedRows);
    }
    if (articlesByType.size > 0) {
      derivedRows = MEDIA_ORDER.reduce((acc, val) => {
        const label = t(`media-downloads.${typeOverrides}type-labels.${val}-article`);
        const files = (articlesByType.get(val) || []).map(file => this.renderRow(file, label, t));
        return acc.concat(files);
      }, derivedRows);
    }
    if (researchMaterialsByType.size > 0) {
      derivedRows = MEDIA_ORDER.reduce((acc, val) => {
        const label = t(`media-downloads.${typeOverrides}type-labels.${val}-research-material`);
        const files = (researchMaterialsByType.get(val) || []).map(file => this.renderRow(file, label, t));
        return acc.concat(files);
      }, derivedRows);
    }

    return (
      <div className="media-downloads content__aside-unit">
        <Grid columns="equal">
          <Grid.Row>
            <Grid.Column>
              <Header as="h3" content={t('media-downloads.title')} />
            </Grid.Column>
            <Grid.Column>
              <DropdownLanguageSelector
                languages={languages}
                defaultValue={language}
                onSelect={this.handleChangeLanguage}
              />
            </Grid.Column>
          </Grid.Row>
        </Grid>
        <Table unstackable className="media-downloads__files" basic="very" compact="very">
          <Table.Body>
            {rows}
            {derivedRows || null}
          </Table.Body>
        </Table>
        {/* moved "derived media to the main downloads table" */}
        {/* {
          derivedRows ?
            <div className="media-downloads__derivations">
              <Header size="tiny" content={t('media-downloads.derived-title')} />
              <Table unstackable basic="very" compact="very">
                <Table.Body>
                  {derivedRows}
                </Table.Body>
              </Table>
            </div>
            : null
        } */}
      </div>
    );
  }
}

export default connect(state => (
  {
    publisherById: selectors.getPublisherById(state.publications),
    language: settings.getLanguage(state.settings),
    contentLanguage: settings.getContentLanguage(state.settings),
  })
)(withNamespaces()(MediaDownloads));

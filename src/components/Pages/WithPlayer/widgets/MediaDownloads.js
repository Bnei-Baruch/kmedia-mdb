import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import CopyToClipboard from 'react-copy-to-clipboard';
import { Button, Grid, Popup, Table, Divider } from 'semantic-ui-react';
import isEqual from 'react-fast-compare';

import {
  CT_ARTICLE,
  CT_FULL_LESSON,
  CT_KITEI_MAKOR,
  CT_LELO_MIKUD,
  CT_LESSON_PART,
  CT_LIKUTIM,
  CT_PUBLICATION,
  CT_RESEARCH_MATERIAL,
  CT_VIDEO_PROGRAM_CHAPTER,
  INSERT_TYPE_SUMMARY,
  MT_AUDIO,
  MT_IMAGE,
  MT_TEXT,
  MT_VIDEO,
  VS_NAMES, POPOVER_CONFIRMATION_TIMEOUT
} from '../../../../helpers/consts';
import { selectSuitableLanguage } from '../../../../helpers/language';
import { downloadLink } from '../../../../helpers/utils';
import { selectors as settings } from '../../../../redux/modules/settings';
import { selectors } from '../../../../redux/modules/publications';
import * as shapes from '../../../shapes';
import { DeviceInfoContext } from '../../../../helpers/app-contexts';
import classNames from 'classnames';
import MenuLanguageSelector from '../../../Language/Selector/MenuLanguageSelector';
import { sizeByQuality } from './helper';
import { settingsGetContentLanguagesSelector } from '../../../../redux/selectors';

const MEDIA_ORDER = [
  MT_VIDEO,
  MT_AUDIO,
  MT_TEXT,
  MT_IMAGE,
];


class MediaDownloads extends Component {
  static contextType = DeviceInfoContext;

  static propTypes = {
    unit: shapes.ContentUnit,
    publisherById: PropTypes.objectOf(shapes.Publisher).isRequired,
    uiLang: PropTypes.string.isRequired,
    contentLanguages: PropTypes.arrayOf(PropTypes.string).isRequired,
    t: PropTypes.func.isRequired,
    displayDivider: PropTypes.bool,
    chroniclesAppend: PropTypes.func.isRequired,
  };

  static defaultProps = {
    unit: undefined
  };

  timeout = {};

  constructor(props) {
    super(props);
    this.state = {};
  }

  static getDerivedStateFromProps(props, state) {
    const { unit = {}, contentLanguages, uiLang } = props;
    const { unit: stateUnit, isCopyPopupOpen = {} }            = state;

    if (stateUnit && isEqual(stateUnit, unit)) {
      // Only language changed.
      if (state.uiLang !== uiLang
        || state.contentLanguages !== contentLanguages) {
        const selectedLanguage = selectSuitableLanguage(contentLanguages, state.availableLanguages, unit.original_language);
        if (state.selectedLanguage !== selectedLanguage) {
          return { ...state, selectedLanguage };
        }
      }

      return null;

    }

    // No unit or a different unit - create new state.
    const groups = MediaDownloads.getFilesByLanguage(unit.files, contentLanguages, unit.original_language);
    const availableLanguages = [...groups.keys()];
    const selectedLanguage = selectSuitableLanguage(contentLanguages, availableLanguages, unit.original_language);
    const derivedGroups = MediaDownloads.getDerivedFilesByContentType(unit.derived_units, contentLanguages, unit.original_language);

    return { groups, derivedGroups, isCopyPopupOpen, availableLanguages, selectedLanguage, uiLang, contentLanguages, unit };

  }

  static getFilesByLanguage = (files = [], contentLanguages, originalLanguage) => {
    const groups = new Map();

    // Keep track of image files. These are a special case. Images, unlike other types, are language agnostic by nature.
    // However, since they might contain text in them we do have language attached to such files. For other languages,
    // whom don't have a dedicated translation of these images we give them the images of their fallback language.
    const images = [];

    const hls = files.find(f => f.video_size === 'HLS' && f.hls_languages && f.video_qualities);
    hls?.hls_languages.forEach(l => {
      const byType = new Map();
      byType.set(MT_AUDIO, [{ ...hls, type: MT_AUDIO, language: l, name: 'audio.mp3', video_size: null }]);
      const videos = hls.video_qualities.map(q => ({
        ...hls,
        type: MT_VIDEO,
        video_size: q,
        language: l,
        size: sizeByQuality(q, hls.duration)
      }));
      byType.set(MT_VIDEO, videos);
      groups.set(l, byType);
    });

    files.filter(f =>
      // Keep non video/audio/hls files.
      !(hls && [MT_VIDEO, MT_AUDIO].includes(f.type))
      // And skip summary files for download.
      && f.insert_type !== INSERT_TYPE_SUMMARY
    ).forEach(file => {
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

    // Sort file lists by size.
    groups.forEach(byType => byType.forEach(v => v.sort((a, b) => a.size - b.size)));

    // Fill in images fallback into every language
    if (images.length > 0) {
      const fallbackImage = MediaDownloads.fallbackImage(images, contentLanguages, originalLanguage);
      fallbackImage && groups.forEach(byType => {
        if (!byType.has(MT_IMAGE)) {
          byType.set(MT_IMAGE, fallbackImage);
        }
      });
    }

    return groups;
  };

  static fallbackImage = (images, contentLanguages, originalLanguage) => {
    const imageLanguages = images.map(image => image.language);
    const imageSelectedLanguage = selectSuitableLanguage(contentLanguages, imageLanguages, originalLanguage);

    // Try looking for selected language, if not exist try looking for original language, otherwise ignore.
    return [
      images.find(image => image.language === imageSelectedLanguage) ||
      images.find(image => image.language === originalLanguage)
    ].filter(image => !!image);
  };

  static getDerivedFilesByContentType = (units, contentLanguages, originalLanguage) => {
    const allByCT = Object.values(units || {})
      .reduce((acc, val) => {
        acc[val.content_type] = (acc[val.content_type] || []).concat((val.files || []).map(x => ({ ...x, cu: val })));
        return acc;
      }, {});

    return Object.entries(allByCT).reduce((acc, val) => {
      const [ct, files] = val;
      acc[ct]           = MediaDownloads.getFilesByLanguage(files, contentLanguages, originalLanguage);
      return acc;
    }, {});
  };

  static getI18nTypeOverridesKey = unit => {
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

  shouldComponentUpdate(nextProps, nextState) {
    const { unit, contentLanguages, uiLang } = nextProps;
    const { props, state }                                = this;

    return !(
      state.selectedLanguage === nextState.selectedLanguage
      && uiLang === props.uiLang
      && contentLanguages === props.contentLanguages
      && isEqual(unit, props.unit)
      && isEqual(state.isCopyPopupOpen, nextState.isCopyPopupOpen)
    );
  }

  handleChangeLanguage = selectedLanguage => {
    this.setState({ selectedLanguage });
  };

  handleCopied = url => {
    this.setState({ isCopyPopupOpen: { ...this.state.isCopyPopupOpen, [url]: true } }, () => {
      setTimeout(() => this.setState({
        isCopyPopupOpen: {
          ...this.state.isCopyPopupOpen,
          [url]: false
        }
      }), POPOVER_CONFIRMATION_TIMEOUT);
    });
  };

  renderRow = (file, label, t) => {
    const { chroniclesAppend } = this.props;
    const { isCopyPopupOpen }  = this.state;
    const ext                  = file.name.substring(file.name.lastIndexOf('.') + 1);
    const url                  = downloadLink(file);

    return (
      <Table.Row key={`${file.id}_${file.video_size}`} className="media-downloads__file" verticalAlign="top">
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
            onClick={() => chroniclesAppend('download', { url, uid: file.id })}
          />
        </Table.Cell>
        <Table.Cell collapsing>
          <Popup
            open={!!isCopyPopupOpen[url]}
            content={t('messages.link-copied-to-clipboard')}
            position="bottom center"
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
    const { t, publisherById, unit, displayDivider }     = this.props;
    const { selectedLanguage, availableLanguages, groups, derivedGroups } = this.state;
    const { isMobileDevice }                             = this.context;

    const byType = groups.get(selectedLanguage) || new Map();

    let typeOverrides = MediaDownloads.getI18nTypeOverridesKey(unit);
    if (typeOverrides) {
      typeOverrides += '.';
    }

    const rows        = this.getRows(byType, t, typeOverrides);
    const derivedRows = this.getDerivedRows(derivedGroups, selectedLanguage, t, typeOverrides, publisherById);

    return (
      <div className="media-downloads content__aside-unit">
        {availableLanguages.length > 1 ?
          <Grid container padded={false} columns={isMobileDevice ? 1 : 2} className={classNames({ 'padding_r_l_0': !isMobileDevice })}>
            {!isMobileDevice &&
              <Grid.Column width={12}>
              </Grid.Column>}
            <Grid.Column width={isMobileDevice ? 16 : 4} textAlign={'right'} className={classNames({ 'padding_r_l_0': !isMobileDevice })}>
              <MenuLanguageSelector
                languages={availableLanguages}
                selected={selectedLanguage}
                onLanguageChange={this.handleChangeLanguage}
                multiSelect={false}
              />
            </Grid.Column>
          </Grid>
          : displayDivider &&
          <Divider></Divider>
        }
        <Table unstackable className="media-downloads__files" basic="very" compact="very">
          <Table.Body>
            {rows}
            {derivedRows || null}
          </Table.Body>
        </Table>
      </div>
    );
  }

  getDerivedRows = (derivedGroups, selectedLanguage, t, typeOverrides, publisherById) => {
    const kiteiMakor              = derivedGroups[CT_KITEI_MAKOR];
    const kiteiMakorByType        = (kiteiMakor && kiteiMakor.get(selectedLanguage)) ?? new Map();
    const likutim                 = derivedGroups[CT_LIKUTIM];
    const likutimByType           = (likutim && likutim.get(selectedLanguage)) ?? new Map();
    const leloMikud               = derivedGroups[CT_LELO_MIKUD];
    const leloMikudByType         = (leloMikud && leloMikud.get(selectedLanguage)) ?? new Map();
    const publications            = derivedGroups[CT_PUBLICATION];
    const publicationsByType      = (publications && publications.get(selectedLanguage)) ?? new Map();
    const articles                = derivedGroups[CT_ARTICLE];
    const articlesByType          = (articles && articles.get(selectedLanguage)) ?? new Map();
    const researchMaterials       = derivedGroups[CT_RESEARCH_MATERIAL];
    const researchMaterialsByType = (researchMaterials && researchMaterials.get(selectedLanguage)) ?? new Map();

    let derivedRows = [];
    if (kiteiMakorByType.size > 0) {
      derivedRows = MEDIA_ORDER.reduce((acc, val) => {
        if (val === MT_TEXT || val === MT_VIDEO) return acc;
        const label = `${t('constants.content-types.KITEI_MAKOR')} - ${t(`constants.media-types.${val}`)}`;
        const files = (kiteiMakorByType.get(val) || []).map(file => this.renderRow(file, label, t));
        return acc.concat(files);
      }, derivedRows);
    }

    if (likutimByType.size > 0) {
      derivedRows = MEDIA_ORDER.reduce((acc, val) => {
        const label = `${t('constants.content-types.LIKUTIM')} - ${t(`constants.media-types.${val}`)}`;
        const files = (likutimByType.get(val) || []).map(file => this.renderRow(file, label, t));
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
        const files = (publicationsByType.get(val) || []).map(file => {
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

    return derivedRows;
  };

  getRows = (byType, t, typeOverrides) => {
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
        const files     = (byType.get(val) || []).map(file => {
          let label = baseLabel;
          if (file.video_size) {
            label = `${label} [${VS_NAMES[file.video_size]}]`;
          }

          return this.renderRow(file, label, t);
        });
        return acc.concat(files);
      }, []);
    }

    return rows;
  };
}

export default connect(state => (
  {
    publisherById: selectors.getPublisherById(state.publications),
    uiLang: settings.getUILang(state.settings),
    contentLanguages: settingsGetContentLanguagesSelector(state),
  })
)(withTranslation()(MediaDownloads));

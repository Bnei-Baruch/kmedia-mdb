import React from 'react';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import isEqual from 'react-fast-compare';
import ImageGallery from 'react-image-gallery';
import { Button, Container, Segment } from 'semantic-ui-react';
import { selectSuitableLanguage } from '../../../../../helpers/language';
import { isLanguageRtl } from '../../../../../helpers/i18n-utils';
import { isEmpty, strCmp } from '../../../../../helpers/utils';
import { actions as assetsActions, selectors } from '../../../../../redux/modules/assets';
import { selectors as settings } from '../../../../../redux/modules/settings';
import * as shapes from '../../../../shapes';
import WipErr from '../../../../shared/WipErr/WipErr';
import MenuLanguageSelector from '../../../../Language/Selector/MenuLanguageSelector';
import { imageGalleryItem, isZipFile } from './helper';
import {
  settingsGetContentLanguagesSelector,
  settingsGetUIDirSelector,
  assetsNestedGetZipByIdSelector
} from '../../../../../redux/selectors';

class Sketches extends React.Component {
  static propTypes = {
    unit: shapes.ContentUnit.isRequired,
    t: PropTypes.func.isRequired,
    zipIndexById: PropTypes.objectOf(shapes.DataWipErr).isRequired,
    unzipList: PropTypes.func.isRequired,
    contentLanguages: PropTypes.arrayOf(PropTypes.string).isRequired
  };

  state = {
    zipFiles: null,
    zipFileId: null,
    imageFiles: null,
    filesLanguages: null,
    selectedLanguage: null
  };

  static getUnitSketchFiles = unit => {
    if (!Array.isArray(unit.files)) {
      return null;
    }

    // get the zip files
    const zipFiles = unit.files.filter(Sketches.isZipOrImageFileType);
    if (zipFiles.length === 0) {
      return null;
    }

    return zipFiles;
  };

  static getFilesLanguages = (zipFiles, contentLanguages, originalLanguage) => {
    const filesLanguages = zipFiles
      .map(file => file.language)
      .filter((v, i, a) => a.indexOf(v) === i);

    const selectedLanguage = selectSuitableLanguage(contentLanguages, filesLanguages, originalLanguage);
    return { filesLanguages, selectedLanguage };
  };

  static filterZipFiles = (zipFiles, selectedLanguage, originalLanguage) => {
    // try filter by language
    let files = zipFiles.filter(file => file.language === selectedLanguage);

    // if no files by language - return original language files
    if (files.length === 0) {
      files = zipFiles.filter(file => file.language === originalLanguage);
    }

    // if there are many zip files - use the first one
    if (files.length > 0) {
      const zipFileArr = files.filter(file => isZipFile(file));
      files            = zipFileArr.length > 0 ? zipFileArr[0] : files;
    }

    return files;
  };

  static isZipOrImageFileType = file => file.type === 'image';

  isPropsChanged = prevProps => {
    const { unit, zipIndexById, contentLanguages } = this.props;

    return prevProps.contentLanguages !== contentLanguages
      || prevProps.unit.id !== unit.id
      || !isEqual(prevProps.zipIndexById, zipIndexById);
  };

  isStateChanged = prevState => {
    const { zipFileId, selectedLanguage, imageFiles } = this.state;

    return prevState.zipFileId !== zipFileId
      || prevState.selectedLanguage !== selectedLanguage
      || prevState.imageFiles !== imageFiles;
  };

  shouldComponentUpdate(nextProps, nextState) {
    const propsChanged = this.isPropsChanged(nextProps);
    const stateChanged = this.isStateChanged(nextState);

    return propsChanged || stateChanged;
  }

  componentDidMount() {
    this.processUnit();
  }

  componentDidUpdate(prevProps, prevState) {
    const { unit, contentLanguages } = this.props;

    if (prevProps.unit.id !== unit.id || !prevState.zipFiles) {
      // full reset
      this.processUnit();
    } else if (prevProps.contentLanguages !== contentLanguages) {
      this.setStateByZipFiles(prevState.zipFiles, contentLanguages, unit);
    } else if (prevState.selectedLanguage !== this.state.selectedLanguage) {
      const { zipFiles, selectedLanguage } = this.state;

      if (zipFiles && Array.isArray(zipFiles)) {
        const itemState = this.getItemState(zipFiles, selectedLanguage, unit);

        this.setState({
          ...itemState
        });
      }
    }
  }

  processUnit = () => {
    const { unit, contentLanguages } = this.props;
    const zipFiles                   = Sketches.getUnitSketchFiles(unit);

    if (zipFiles) {
      this.setStateByZipFiles(zipFiles, contentLanguages, unit);
    } else {
      this.setState({ zipFileId: null, imageFiles: null });
    }
  };

  setStateByZipFiles = (zipFiles, contentLanguages, unit) => {
    const {
            filesLanguages,
            selectedLanguage
          }         = Sketches.getFilesLanguages(zipFiles, contentLanguages, unit.original_language);
    const itemState = this.getItemState(zipFiles, selectedLanguage, unit);

    this.setState({ zipFiles, filesLanguages, selectedLanguage, ...itemState });
  };

  getItemState = (zipFiles, selectedLanguage, unit) => {
    const files = Sketches.filterZipFiles(zipFiles, selectedLanguage, unit.original_language);
    return this.getStateByFile(files);
  };

  // get one zip file or array of image files or one image file
  getStateByFile = file => {
    let state = {};
    if (file) {
      // not zip, image files only
      if (Array.isArray(file) || !isZipFile(file)) {
        state = { imageFiles: file };
      } else {
        // zip file
        state = { zipFileId: file.id };

        // call redux
        this.unzipFiles(file);
      }
    } else {
      state = { zipFileId: null };
    }

    return state;
  };

  unzipFiles = file => {
    const { zipIndexById, unzipList } = this.props;
    const { data, wip, err }          = zipIndexById[file.id] || {};

    if (!wip && !err && isEmpty(data) && !Object.prototype.hasOwnProperty.call(zipIndexById, file.id)) {
      unzipList([file.id]);
    }
  };

  handleLanguageChanged = selectedLanguage => {
    this.setState({ selectedLanguage });
    this._imageGallery.slideToIndex(0);
  };

  handleImageError = event => console.log('Image Gallery loading error ', event.target);

  removeErroneousImages = item =>
    !item.path?.toUpperCase().includes('MACOSX');

  renderLeftNav = (onClick, disabled) => (
    <Button
      color="black"
      size="tiny"
      className="image-gallery-left-nav"
      icon="chevron left"
      disabled={disabled}
      onClick={onClick}
    />
  );

  renderRightNav = (onClick, disabled) => (
    <Button
      color="black"
      size="tiny"
      className="image-gallery-right-nav"
      icon="chevron right"
      disabled={disabled}
      onClick={onClick}
    />
  );

  renderFullscreenButton = (onClick, isFullscreen) => (
    <Button
      color="black"
      size="tiny"
      className="image-gallery-fullscreen-button"
      icon={isFullscreen ? 'compress' : 'expand'}
      onClick={onClick}
    />
  );

  render() {
    const { t, zipIndexById, uiDir }                                  = this.props;
    const { zipFileId, filesLanguages, selectedLanguage, imageFiles } = this.state;
    const { wip, err, data }                                          = zipIndexById[zipFileId] || {};

    const wipErr = WipErr({ wip, err, t });
    if (wipErr) {
      return wipErr;
    }

    const imageObjs = imageFiles || data?.full;

    // if imageObjs is not an array - create it
    let imageObjsArr = [];
    if (imageObjs) {
      if (Array.isArray(imageObjs)) {
        imageObjsArr = imageObjs;
      } else {
        imageObjsArr.push(imageObjs);
      }

      if (imageObjsArr.length > 0) {
        // prepare the image array for the gallery and sort it
        const items = imageObjsArr
          .filter(this.removeErroneousImages)
          .map(imageGalleryItem)
          .sort((a, b) => strCmp(a.original, b.original));

        return (
          <div>
            {
              filesLanguages && filesLanguages.length > 1
                ? (
                  <Container fluid textAlign="right" className="padded">
                    <MenuLanguageSelector
                      languages={filesLanguages}
                      selected={selectedLanguage}
                      onLanguageChange={this.handleLanguageChanged}
                      multiSelect={false}
                    />
                  </Container>
                )
                : null
            }
            <ImageGallery
              ref={i => this._imageGallery = i}
              lazyLoad
              showFullscreenButton
              isRTL={uiDir === 'rtl'}
              items={items}
              thumbnailPosition="top"
              showPlayButton={false}
              showBullets={false}
              showIndex={items.length > 1}
              showThumbnails={items.length > 1}
              onImageError={this.handleImageError}
              renderLeftNav={this.renderLeftNav}
              renderRightNav={this.renderRightNav}
              renderFullscreenButton={this.renderFullscreenButton}
            />
          </div>
        );
      }
    }

    return (
      <Segment basic>
        {t('messages.no-images')}
      </Segment>
    );
  }
}

const mapState = state => ({
  zipIndexById: assetsNestedGetZipByIdSelector(state),
  uiDir: settingsGetUIDirSelector(state),
  contentLanguages: settingsGetContentLanguagesSelector(state)
});

const mapDispatch = dispatch => bindActionCreators({
  unzipList: assetsActions.unzipList
}, dispatch);

export default connect(mapState, mapDispatch)(withTranslation()(Sketches));

import React from 'react';
import PropTypes from 'prop-types';
import { withNamespaces } from 'react-i18next';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import isEqual from 'react-fast-compare';
import ImageGallery from 'react-image-gallery';
import { Button, Container, Segment } from 'semantic-ui-react';

import { assetUrl, imaginaryUrl, Requests } from '../../../../../helpers/Api';
import { RTL_LANGUAGES } from '../../../../../helpers/consts';
import { selectSuitableLanguage } from '../../../../../helpers/language';
import { isEmpty, physicalFile, strCmp } from '../../../../../helpers/utils';
import { actions, selectors } from '../../../../../redux/modules/assets';
import { selectors as settings } from '../../../../../redux/modules/settings';
import * as shapes from '../../../../shapes';
import WipErr from '../../../../shared/WipErr/WipErr';
import ButtonsLanguageSelector from '../../../../Language/Selector/ButtonsLanguageSelector';

class Sketches extends React.Component {
  static propTypes = {
    unit: shapes.ContentUnit.isRequired,
    t: PropTypes.func.isRequired,
    zipIndexById: PropTypes.objectOf(shapes.DataWipErr).isRequired,
    unzip: PropTypes.func.isRequired,
    uiLanguage: PropTypes.string.isRequired,
    contentLanguage: PropTypes.string.isRequired,
  };

  static getUnitFiles = (unit) => {
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

  static getFilesLanguages = (zipFiles, contentLanguage, uiLanguage) => {
    const languages = zipFiles
      .map(file => file.language)
      .filter((v, i, a) => a.indexOf(v) === i);

    const language  = selectSuitableLanguage(contentLanguage, uiLanguage, languages);
    return { languages, language };
  };

  static filterZipFiles = (zipFiles, language, originalLanguage) => {
    // try filter by language
    let files = zipFiles.filter(file => file.language === language);

    // if no files by language - return original language files
    if (files.length === 0) {
      files = zipFiles.filter(file => file.language === originalLanguage);
    }

    // if there are many zip files - use the first one
    if (files.length > 0) {
      const zipFileArr = files.filter(file => Sketches.isZipFile(file));
      files            = zipFileArr.length > 0 ? zipFileArr[0] : files;
    }

    return files;
  };

  static isZipFile = (file) => file.name.endsWith('.zip');

  static isZipOrImageFileType = file => file.type === 'image';

  state = {
    zipFiles: null,
    zipFileId: null,
    imageFiles: null,
    languages: null,
    language: null,
  };
  
  isPropsChanged = (prevProps) => {
    const { unit, zipIndexById, contentLanguage, uiLanguage } = this.props;

    return prevProps.contentLanguage !== contentLanguage
      || prevProps.uiLanguage !== uiLanguage
      || prevProps.unit.id !== unit.id
      || !isEqual(prevProps.zipIndexById, zipIndexById)
  };

  isStateChanged = (prevState) => {
    const { zipFileId, language, imageFiles } = this.state;
    console.log('state language:', language, prevState.language);

    return prevState.zipFileId !== zipFileId
      || prevState.language !== language
      || prevState.imageFiles !== imageFiles;
  };

  shouldComponentUpdate(nextProps, nextState) {
    const propsChanged = this.isPropsChanged(nextProps);
    const stateChanged = this.isStateChanged(nextState);

    console.log('propsChanged:', propsChanged, ' stateChanged:', stateChanged);

    return propsChanged || stateChanged; 
  }

  componentDidMount(){
    this.processUnit();
  }

  componentDidUpdate(prevProps, prevState) {
    const { unit, contentLanguage, uiLanguage } = this.props;

    if (prevProps.unit.id !== unit.id || !prevState.zipFiles){
      // full reset
      this.processUnit();
    }
    else if (prevProps.contentLanguage !== contentLanguage 
          || prevProps.uiLanguage !== uiLanguage){
      this.setStateByZipFiles(prevState.zipFiles, contentLanguage, uiLanguage, unit);
    }
    else if (prevState.language !== this.state.language) {
      const { zipFiles, language } = this.state;

      console.log('componentDidUpdate prevState.language:', prevState.language, language);

      if (zipFiles && Array.isArray(zipFiles)) {
        const itemState = this.getItemState(zipFiles, language, unit);

        this.setState({
          ...itemState,
        });
      }
    }
  }

  processUnit = () => {
    const { unit, contentLanguage, uiLanguage } = this.props;
    const zipFiles = Sketches.getUnitFiles(unit);

    if (zipFiles) {
      this.setStateByZipFiles(zipFiles, contentLanguage, uiLanguage, unit);
    }
  }

  setStateByZipFiles = (zipFiles, contentLanguage, uiLanguage, unit) => {
    const { languages, language } = Sketches.getFilesLanguages(zipFiles, contentLanguage, uiLanguage);
    const itemState = this.getItemState(zipFiles, language, unit);

    this.setState({ zipFiles, languages, language, ...itemState });
  }


  getItemState = (zipFiles, language, unit) => {
    const files = Sketches.filterZipFiles(zipFiles, language, unit.original_language);
    const itemState = this.getStateByFile(files);
    return itemState;
  }

  // get one zip file or array of image files or one image file
  getStateByFile = (file) => {
    let state = {};
    if (file) {
      // not zip, image files only
      if (Array.isArray(file) || !Sketches.isZipFile(file)) {
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

  unzipFiles = (file) => {
    const { zipIndexById, unzip } = this.props;
    const { data, wip, err }      = zipIndexById[file.id] || {};

    if (!(wip || err) && isEmpty(data) && !Object.prototype.hasOwnProperty.call(zipIndexById, file.id)) {
      unzip(file.id);
    }
  };

  handleLanguageChanged = (e, language) => {
    this.setState({ language });
  };

  handleImageError = event => console.log('Image Gallery loading error ', event.target);

  // converts images from server format (path, size) to ImageGallery format
  imageGalleryItem = (item) => {
    let src;
    let alt;
    if (item.path) {
      // opened zip file
      src = assetUrl(item.path.substr(8));
      alt = item.path.substr(item.path.lastIndexOf('_') + 1);
    } else {
      // image file
      src = physicalFile(item);
      alt = item.name;
    }

    let thumbSrc = src;
    if (!thumbSrc.startsWith('http')) {
      thumbSrc = `http://localhost${src}`;
    }
    thumbSrc = `${imaginaryUrl('thumbnail')}?${Requests.makeParams({ url: thumbSrc, width: 100 })}`;

    return {
      original: src,
      thumbnail: thumbSrc,
      originalAlt: alt,
      thumbnailAlt: `${alt}-thumbnail`,
      thumbnailTitle: `${alt}`,
    };
  };

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
    const { t, zipIndexById }                            = this.props;
    const { zipFileId, languages, language, imageFiles } = this.state;
    const { wip, err, data }                             = zipIndexById[zipFileId] || {};

    const wipErr = WipErr({ wip, err, t });
    if (wipErr) {
      return wipErr;
    }

    const imageObjs = imageFiles || data;

    // if imageObjs is not an array - create it
    let imageObjsArr = [];
    if (imageObjs && !Array.isArray(imageObjs)) {
      imageObjsArr.push(imageObjs);
    } else {
      imageObjsArr = imageObjs;
    }

    const isRTL = RTL_LANGUAGES.includes(language);

    if (Array.isArray(imageObjsArr) && imageObjsArr.length > 0) {
      // prepare the image array for the gallery and sort it
      const items = imageObjsArr
        .map(this.imageGalleryItem)
        .sort((a, b) => strCmp(a.original, b.original));

      return (
        <div>
          {
            languages && languages.length > 1
              ? (
                <Container fluid textAlign="center">
                  <ButtonsLanguageSelector
                    languages={languages}
                    defaultValue={language}
                    onSelect={this.handleLanguageChanged}
                  />
                </Container>
              )
              : null
          }
          <ImageGallery
            lazyLoad
            showFullscreenButton
            isRTL={isRTL}
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

    return (
      <Segment basic>
        {t('messages.no-images')}
      </Segment>
    );
  }
}

const mapState = state => ({
  zipIndexById: selectors.getZipIndexById(state.assets),
  uiLanguage: settings.getLanguage(state.settings),
  contentLanguage: settings.getContentLanguage(state.settings),
});

const mapDispatch = dispatch => bindActionCreators({
  unzip: actions.unzip
}, dispatch);

export default connect(mapState, mapDispatch)(withNamespaces()(Sketches));

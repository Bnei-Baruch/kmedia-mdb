import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import ImageGallery from 'react-image-gallery';
import 'react-image-gallery/styles/css/image-gallery.css';
import { Container, Divider, Segment } from 'semantic-ui-react';

import { RTL_LANGUAGES } from '../../../../../helpers/consts';
import { assetUrl, imaginaryUrl, Requests } from '../../../../../helpers/Api';
import { physicalFile, strCmp } from '../../../../../helpers/utils';
import { actions, selectors } from '../../../../../redux/modules/assets';
import { selectors as settings } from '../../../../../redux/modules/settings';
import * as shapes from '../../../../shapes';
import WipErr from '../../../../shared/WipErr/WipErr';
import ButtonsLanguageSelector from '../../../../Language/Selector/ButtonsLanguageSelector';

class Sketches extends React.Component {

  static propTypes = {
    unit: shapes.ContentUnit.isRequired,
    t: PropTypes.func.isRequired,
    zipIndexById: PropTypes.objectOf(PropTypes.shape({
      data: PropTypes.arrayOf(PropTypes.object),
      wip: shapes.WIP,
      err: shapes.Error,
    })).isRequired,
    unzip: PropTypes.func.isRequired,
    language: PropTypes.string.isRequired
  };

  state = {
    zipFileId: null,
    imageFiles: null,
    languages: null,
    language: null,
  };

  componentDidMount() {
    this.setCurrentItem(this.props);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.zipIndexById !== this.props.zipIndexById ||
      nextProps.unit !== this.props.unit) {
      this.setCurrentItem(nextProps);
    }
  }

  // load data into state
  setCurrentItem = (props, selectedLanguage) => {
    const { unit, zipIndexById, unzip } = props;
    const language                      = selectedLanguage ? selectedLanguage : props.language;
    const files                         = this.findZipOrImageFiles(unit, language);

    if (!files) {
      this.setState({ zipFileId: null, language });
    }
    else if (files[0] && !files[0].name.endsWith('.zip')) {
      this.setState({ imageFiles: files, language }); //not zip, image files only
    }
    else {
      this.setState({ zipFileId: files.id, language });

      const hasData = zipIndexById && zipIndexById[files.id];
      if (!hasData) {
        unzip(files.id);
      }
    }
  };

  findZipOrImageFiles = (unit, selectedLanguage) => {
    if (Array.isArray(unit.files)) {
      //get the zip files
      const zipFiles = unit.files.filter(this.filterZipOrImageFiles);

      if (!Array.isArray(zipFiles) || zipFiles.length === 0)
        return null;

      //at least one file
      if (zipFiles.length === 1)
        return zipFiles[0];
      else {
        //many files - get all existing unique languages
        const languages = zipFiles
          .map((file) => file.language)
          .filter((v, i, a) => a.indexOf(v) === i);
        this.setState({ languages });

        // try filter by language
        let files;
        const langZipFiles = zipFiles.filter((file) => file.language === selectedLanguage);

        if (Array.isArray(langZipFiles) && langZipFiles.length > 0) {
          files = this.zipOrImageFiles(langZipFiles);
        }
        else {
          //no file by language - return the original file
          const originalFiles = zipFiles.filter((file) => file.language === unit.original_language);
          files               = this.zipOrImageFiles(originalFiles);
        }

        return files;
      }
    }
    else {
      return null;
    }
  };

  filterZipOrImageFiles = (file) => {
    return file.type === 'image';
  };

  //if not zip return all image files, otherwise the first zip file
  zipOrImageFiles = (files) => {
    return !(Array.isArray(files) && files.length > 0) ?
      null :
      !files[0].name.endsWith('.zip') ? files : files[0];
  };

  //converts images from server format (path, size) to ImageGallery format
  imageGalleryItem = (item) => {
    let src, thumbSrc, alt;

    if (item.path) {
      //opened zip file
      src = assetUrl(item.path.substr(8));
      alt = item.path.substr(item.path.lastIndexOf('_') + 1);
    }
    else {
      //image file
      src = physicalFile(item);
      alt = item.name;
    }

    thumbSrc = src;
    if (!thumbSrc.startsWith('http')) {
      thumbSrc = 'http://localhost' + src;
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

  handleLanguageChanged = (e, language) => {
    this.setCurrentItem(this.props, language);
  };

  handleImageError(event) {
    console.log('Image Gallery loading error ', event.target);
  }

  render() {
    const { t, zipIndexById }                            = this.props;
    const { zipFileId, languages, language, imageFiles } = this.state;
    const { wip, err, data }                             = zipIndexById[zipFileId] || {};

    const wipErr = WipErr({ wip, err, t });
    if (wipErr) {
      return wipErr;
    }

    const imageObjs = imageFiles ? imageFiles : data;

    if (Array.isArray(imageObjs) && imageObjs.length > 0) {

      //prepare the image array for the gallery and sort it
      const items = imageObjs
        .map(this.imageGalleryItem)
        .sort((a, b) => strCmp(a.original, b.original));

      return (
        <div>
          {
            languages && languages.length > 1 ?
              <Container fluid textAlign="center">
                <ButtonsLanguageSelector
                  languages={languages}
                  defaultValue={language}
                  t={t}
                  onSelect={this.handleLanguageChanged}
                />
              </Container> :
              null
          }
          <div style={{ direction: 'ltr' }}>
            <ImageGallery
              items={items}
              thumbnailPosition={'top'}
              lazyLoad={true}
              showPlayButton={false}
              showBullets={false}
              showFullscreenButton={true}
              showIndex={true}
              showThumbnails={items.length > 1}
              onImageError={this.handleImageError}
            />
          </div>
          <Divider hidden />
        </div>
      );
    }

    const direction = RTL_LANGUAGES.includes(language) ? 'rtl' : 'ltr';
    return (
      <Segment basic>
        <div style={{ direction }}>{t('messages.no-images')}</div>
      </Segment>
    );
  }

}

const mapState = (state) => {
  return {
    zipIndexById: selectors.getZipIndexById(state.assets),
    language: settings.getLanguage(state.settings)
  };
};

const mapDispatch = (dispatch) => {
  return bindActionCreators({
    unzip: actions.unzip
  }, dispatch);
};

export default connect(mapState, mapDispatch)(Sketches);

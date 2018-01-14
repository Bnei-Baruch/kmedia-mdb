import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import ImageGallery from 'react-image-gallery';
import 'react-image-gallery/styles/css/image-gallery.css';

import { RTL_LANGUAGES } from '../../../../../helpers/consts';
import { assetUrl, imaginaryUrl, Requests } from '../../../../../helpers/Api';
import { actions, selectors } from '../../../../../redux/modules/assets';
import { selectors as settings } from '../../../../../redux/modules/settings';
import * as shapes from '../../../../shapes';
import WipErr from '../../../../shared/WipErr/WipErr';

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
  setCurrentItem = (props) => {
    const { unit, zipIndexById, unzip } = props;
    const zipFile                       = this.findZipFile(unit);

    if (!zipFile) {
      this.setState({ zipFileId: null });
    }
    else {
      this.setState({ zipFileId: zipFile.id });

      const hasData = zipIndexById && zipIndexById[zipFile.id];
      if (!hasData) {
        unzip(zipFile.id);
      }
    }
  };

  findZipFile = (unit) => {
    if (Array.isArray(unit.files)) {
      //get the zip files
      const zipFiles = unit.files.filter(this.filterZipFile);

      if (!Array.isArray(zipFiles) || zipFiles.length === 0)
        return null;

      //at least one zip file
      if (zipFiles.length === 1)
        return zipFiles[0];
      else {
        //many zip files - try filter by language
        const langZipFiles = zipFiles.filter((file) => file.language === this.props.language);

        //sometimes there are many zipfiles for one language, so get the first of them
        if (langZipFiles.length >= 1)
          return langZipFiles[0];
        else {
          //no file by language - return the original zip file
          const originalFile = zipFiles.filter((file) => file.language === unit.original_language);
          return originalFile ? originalFile[0] : null;
        }
      }
    }
    else
      return null;
  };

  filterZipFile = (file) => {
    return file.type === 'image';
  };

  handleImageError(event) {
    console.log('Image error ', event.target);
  }

  render() {
    const { t, zipIndexById, language } = this.props;
    const { zipFileId }                 = this.state;
    const { wip, err, data: imageObjs } = zipIndexById[zipFileId] || {};

    const wipErr = WipErr({ wip, err, t });
    if (wipErr) {
      return wipErr;
    }

    if (Array.isArray(imageObjs) && imageObjs.length > 0) {
      //prepare the image array for the gallery and sort it
      const items = imageObjs
        .map(imageGalleryItem)
        .sort((a, b) => {
          if (a.original < b.original) {
            return 1;
          } else if (a.original > b.original) {
            return -1;
          } else {
            return 0;
          }
        });

      return (
        <div style={{ direction: 'ltr' }}>
          <ImageGallery
            items={items}
            thumbnailPosition={'top'}
            lazyLoad={true}
            showPlayButton={false}
            showBullets={false}
            showFullscreenButton={false}
            showIndex={true}
            onImageError={this.handleImageError}
          />
        </div>
      );
    }

    const direction = RTL_LANGUAGES.includes(language) ? 'rtl' : 'ltr';
    return <div style={{ direction }}>{t('messages.no-images')}</div>;
  }
}

//converts images from server format (path, size) to ImageGallery format
const imageGalleryItem = (item) => {
  const src = assetUrl(item.path.substr(8));

  let thumbSrc = src;
  if (!thumbSrc.startsWith('http')) {
    thumbSrc = 'http://localhost' + thumbSrc;
  }
  thumbSrc = `${imaginaryUrl('thumbnail')}?${Requests.makeParams({ url: thumbSrc, width: 100 })}`;

  const alt = item.path.substr(item.path.lastIndexOf('_') + 1);

  return {
    original: src,
    thumbnail: thumbSrc,
    originalAlt: alt,
    thumbnailAlt: `${alt}-thumbnail`,
    thumbnailTitle: `${alt}`,
  };
};

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

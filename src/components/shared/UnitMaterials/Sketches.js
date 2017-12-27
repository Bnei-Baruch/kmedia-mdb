import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import ImageGallery from 'react-image-gallery';
import 'react-image-gallery/styles/css/image-gallery.css';

import { formatError } from '../../../helpers/utils';
import { assetUrl, imaginaryUrl, Requests } from '../../../helpers/Api';
import { actions, selectors } from '../../../redux/modules/assets';
import * as shapes from '../../shapes';
import { ErrorSplash, FrownSplash, LoadingSplash } from '../../shared/Splash';

class Sketches extends React.Component {
  static propTypes = {
    unit: shapes.ContentUnit.isRequired,
    t: PropTypes.func.isRequired,
    indexById: PropTypes.objectOf(PropTypes.shape({
      data: PropTypes.arrayOf(PropTypes.object),
      wip: shapes.WIP,
      err: shapes.Error,
    })).isRequired,
    fetchAsset: PropTypes.func.isRequired,
  };

  state = {
    zipFileId: null,
  };

  componentDidMount() {
    this.setCurrentItem(this.props);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.indexById !== this.props.indexById ||
      nextProps.unit !== this.props.unit) {
      this.setCurrentItem(nextProps);
    }
  }

  // load data into state
  setCurrentItem = (props) => {
    const { unit, indexById, fetchAsset } = props;
    const zipFile                         = this.findZipFile(unit);

    if (!zipFile) {
      this.setState({ zipFileId: null });
    } else {
      this.setState({ zipFileId: zipFile.id });

      const hasData = indexById && indexById[zipFile.id];
      if (!hasData) {
        fetchAsset(zipFile.id);
      }
    }
  };

  findZipFile = (unit) => {
    return Array.isArray(unit.files) ?
      unit.files.find(this.filterZipFile) :
      null;
  };

  filterZipFile = (file) => {
    return file.type === 'image';
  };

  handleImageError(event) {
    console.log('Image error ', event.target);
  }

  render() {
    const { t, indexById }              = this.props;
    const { zipFileId }                 = this.state;
    const { wip, err, data: imageObjs } = indexById[zipFileId] || {};

    if (err) {
      if (err.response && err.response.status === 404) {
        return (
          <FrownSplash text={t('messages.sketches-not-found')} />
        );
      }

      return <ErrorSplash text={t('messages.server-error')} subtext={formatError(err)} />;
    }

    if (wip) {
      return <LoadingSplash text={t('messages.loading')} subtext={t('messages.loading-subtext')} />;
    }

    if (Array.isArray(imageObjs) && imageObjs.length > 0) {

      //prepare the image array for the gallery and sort it
      const items = imageObjs
        .map(imageGalleryItem)
        .sort((a, b) => {
          if (a.original < b.original) {
            return -1;
          } else if (a.original > b.original) {
            return 1;
          } else {
            return 0;
          }
        });

      return (
        <ImageGallery
          items={items}
          thumbnailPosition={'top'}
          lazyLoad={true}
          showPlayButton={false}
          showBullets={true}
          showFullscreenButton={false}
          onImageError={this.handleImageError}
        />
      );
    }

    return (<div>{t('messages.no-images')}</div>);
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

const mapState = (state) => ({
  indexById: selectors.getIndexById(state.assets)
});

const mapDispatch = (dispatch) => {
  return bindActionCreators({
    fetchAsset: actions.fetchAsset
  }, dispatch);
};

export default connect(mapState, mapDispatch)(Sketches);

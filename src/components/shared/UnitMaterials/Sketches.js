import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Trans } from 'react-i18next';
import ImageGallery from 'react-image-gallery';
import 'react-image-gallery/styles/css/image-gallery.css';

import { formatError } from '../../../helpers/utils';
import { assetUrl, imaginaryUrl, Requests } from '../../../helpers/Api';
import { actions, selectors } from '../../../redux/modules/assets';
import * as shapes from '../../shapes';
import { ErrorSplash, FrownSplash, LoadingSplash } from '../../shared/Splash';
import Link from '../../Language/MultiLanguageLink';

class Sketches extends React.Component {
  static propTypes = {
    unit: shapes.ContentUnit.isRequired,
    t: PropTypes.func.isRequired,
    wip: PropTypes.bool,
    err: shapes.Error,
    fetchAsset: PropTypes.func.isRequired,
    imageObjs: PropTypes.arrayOf(PropTypes.object),
  };

  static defaultProps = {
    wip: false,
    err: null,
    imageObjs: [],
  };

  componentDidMount() {
    //load data
    this.unzipFile(this.props);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.unit !== this.props.unit)
      this.unzipFile(nextProps);
  }

  unzipFile(props) {
    const { wip, err } = props;

    if (err)
      console.log('Error during unzip file ', err);
    else if (!wip) {
      const zipFile = this.findZipFile(props);
      if (zipFile) {
        props.fetchAsset(zipFile.id);
      }
    }
  }

  findZipFile = (props) => {
    const { unit } = props;
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
    const { t, wip, err, imageObjs } = this.props;

    if (err) {
      if (err.response && err.response.status === 404) {
        return (
          <FrownSplash
            text={t('messages.program-not-found')}
            subtext={
              <Trans i18nKey="messages.program-not-found-subtext">
                Try the <Link to="/programs">programs list</Link>...
              </Trans>
            }
          />
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
        .sort((a, b) => a.original < b.original);

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

    return (<div>No Images found</div>);
  }
}

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
    imageObjs: selectors.getItems(state.assets),
    wip: selectors.getWip(state.assets),
    err: selectors.getErrors(state.assets),
  };
};

const mapDispatch = (dispatch) => {
  return bindActionCreators({
    fetchAsset: actions.fetchAsset
  }, dispatch);
};

export default connect(mapState, mapDispatch)(Sketches);

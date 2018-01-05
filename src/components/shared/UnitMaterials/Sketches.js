import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import ImageGallery from 'react-image-gallery';
import 'react-image-gallery/styles/css/image-gallery.css';

import { RTL_LANGUAGES } from '../../../helpers/consts';
import { formatError } from '../../../helpers/utils';
import { assetUrl, imaginaryUrl, Requests } from '../../../helpers/Api';
import { actions, selectors } from '../../../redux/modules/assets';
import { selectors as settings } from '../../../redux/modules/settings';
import * as shapes from '../../shapes';
import { ErrorSplash, FrownSplash, LoadingSplash } from '../../shared/Splash';
import GridRow from 'semantic-ui-react/dist/commonjs/collections/Grid/GridRow';
import { Divider, Dropdown, Grid, Segment } from 'semantic-ui-react';
import ButtonsLanguageSelector from '../../Language/Selector/ButtonsLanguageSelector';

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
    language : PropTypes.string.isRequired
  };

  state = {
    zipFileId: null,
    languages: null,
    language: null,
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
    const { unit, indexById, fetchAsset, language } = props;
    const zipFile                                   = this.findZipFile(unit);

    if (!zipFile) {
      this.setState({ zipFileId: null, language });
    }
    else {
      this.setState({ zipFileId: zipFile.id, language });

      const hasData = indexById && indexById[zipFile.id];
      if (!hasData) {
        fetchAsset(zipFile.id);
      }
    }
  };

  findZipFile = (unit) => {
    if (Array.isArray(unit.files)) {
      //get the zip files
      const zipFiles = unit.files.filter(this.filterZipFiles);

      if (!Array.isArray(zipFiles) || zipFiles.length === 0)
        return null;

      //at least one zip file
      if (zipFiles.length === 1)
        return zipFiles[0];
      else {
        //many zip files 
        //get all existing unique languages of zipFiles 
        const languages = zipFiles
                            .map((file) => file.language)
                            .filter((v, i, a) => a.indexOf(v) === i);
        this.setState({ languages });

        // try filter by language
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

  filterZipFiles = (file) => {
    return file.type === 'image';
  };

  handleLanguageChanged = (language) => {
    this.setState({ language });
  } 

  handleImageError(event) {
    console.log('Image error ', event.target);
  }

  render() {
    const { t, indexById }                    = this.props;
    const { zipFileId, languages, language }  = this.state;
    const { wip, err, data: imageObjs } = indexById[zipFileId] || {};

    if (err) {
      if (err.response && err.response.status === 404) {
        return <FrownSplash text={t('messages.sketches-not-found')} />;
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
            return 1;
          } else if (a.original > b.original) {
            return -1;
          } else {
            return 0;
          }
        });

      return (
        <div style={{ direction: 'ltr' }}>
          <Grid>
            {
              languages && languages.length > 0 ?
              <Grid.Row>
                <Grid.Column width={4} textAlign="right">
                  <ButtonsLanguageSelector
                      languages={languages}
                      defaultValue={language}
                      t={t}
                      onSelect={this.handleLanguageChanged}
                    />
                </Grid.Column>
              </Grid.Row> :
              null
            }
            <Grid.Row>
              <Grid.Column>
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
                </Grid.Column>
            </Grid.Row>  
          </Grid>
          <Divider hidden />
        </div>
      );
    }

    const direction = RTL_LANGUAGES.includes(language) ? 'rtl' : 'ltr';
    return <Segment basic><div style={{ direction }}>{t('messages.no-images')}</div></Segment>;
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
    indexById : selectors.getIndexById(state.assets),
    language: settings.getLanguage(state.settings)
  };
};

const mapDispatch = (dispatch) => {
  return bindActionCreators({
    fetchAsset: actions.fetchAsset
  }, dispatch);
};

export default connect(mapState, mapDispatch)(Sketches);

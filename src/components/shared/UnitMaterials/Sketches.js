import "react-image-gallery/styles/css/image-gallery.css";
import ImageGallery from 'react-image-gallery';
import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { actions, selectors } from '../../../redux/modules/assets';
import { ErrorSplash, FrownSplash, LoadingSplash } from '../../shared/Splash';
import Link from '../../Language/MultiLanguageLink';
import { Trans } from 'react-i18next';
import { formatError } from '../../../helpers/utils';
import { assetUrl } from '../../../helpers/Api';
import PropTypes from 'prop-types';
import * as shapes from '../../shapes';

class Sketches extends React.Component {
    static propTypes = {
        unit: shapes.ContentUnit.isRequired,
        t: PropTypes.func.isRequired,
        wip: PropTypes.bool,
        err: shapes.Error,
        fetchAsset: PropTypes.func.isRequired,
        imageObjs: PropTypes.arrayOf(PropTypes.object),        
    }

    componentDidMount(){
        //load data
        this.unzipFile(this.props);    
    }

    componentWillReceiveProps(nextProps){
        if (nextProps.unit !== this.props.unit)
            this.unzipFile(nextProps);
    }

    unzipFile(myProps){
        const {wip, err} = myProps;

        if (err)
            console.log("Error during unzip file ", err);
        else if (!wip){
            //get zip file - heb_o_rav_2017-10-30_lesson_bs-pticha_n1_p2_pic01-10.zip
            const zipFile = this.findZipFile(myProps);

            //raise event to open the zip file by the server
            if (zipFile)
                myProps.fetchAsset(zipFile.id);
        }
    }

    findZipFile = (myProps) => {
        const zipFile = myProps.unit.files == null 
                                 ? null 
                                 : myProps.unit.files.find(this.filterZipFile);
        console.log("Gabis zip image file: ", zipFile);
        return zipFile;
     }
 
     filterZipFile = (file) => {
         return file.type === "image";
     }

    handleImageLoad(event) {
        console.log('Image loaded ', event.target);
    }

    handleImageError(event){
        console.log('Image error ', event.target);
    }

    render() {  
        const {t, wip, err, imageObjs } = this.props;
        
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

        if (imageObjs != null && imageObjs.length > 0){
            //prepare the image array for the gallery and sort it 
            const imageFiles = imageObjs.map(imageGalleryItem).sort((a,b) => a.original < b.original);     
            
            return ( < ImageGallery items = { imageFiles }
                                    slideInterval = { 2000 }
                                    onImageLoad = { this.handleImageLoad }
                                    onImageError = { this.handleImageError }
                                    showPlayButton = { false }
                                    showBullets = { true }
                    />
            );
        }
        else{
            return (<div>No Images found</div>);
        }
    }
}

const imageGalleryItem = (item) => {
    return{
        original: assetUrl(item.path.substr(8)),
        //thumbnail: item.path,
        //sizes: item.size
    }
}

//Redux
const mapState = (state) => {
    return {
        imageObjs: selectors.getItems(state.assets),
        wip: selectors.getWip(state.assets),
        err: selectors.getErrors(state.assets),
    }
}

const mapDispatch = (dispatch) => {
    return bindActionCreators({
        fetchAsset: actions.fetchAsset
    }, dispatch);
}

export default connect(mapState, mapDispatch)(Sketches);
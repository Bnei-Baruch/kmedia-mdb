import "react-image-gallery/styles/css/image-gallery.css";
import ImageGallery from 'react-image-gallery';
import React from 'react';
import { ErrorSplash, FrownSplash, LoadingSplash } from '../../shared/Splash';
import Link from '../../Language/MultiLanguageLink';
import { Trans, translate } from 'react-i18next';
import { formatError } from '../../../helpers/utils';
import PropTypes from 'prop-types';
import * as shapes from '../../shapes';

class Sketches extends React.Component {
    static propTypes = {
        unit: shapes.ContentUnit.isRequired,
        t: PropTypes.func.isRequired,
        wip: PropTypes.bool,
        err: shapes.Error,
    }

    state = {
        images: []
    }

    componentDidMount(){
        //load data
        this.unzipFile(this.props);    
    }

    componentWillReceiveProps(nextProps){
        this.unzipFile(nextProps);
    }

    unzipFile(myProps){
        const {t, wip, err } = myProps;
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

        const zipFile = this.zipFile(myProps);
        
        //open the zip file by the server
        
        //set images into state
        
        //temp images
        this.setImages();    
    }

    zipFile = (myProps) => {
        const zipFile = myProps.unit.files == null 
                                 ? null 
                                 : myProps.unit.files.find(this.findZipFile);
        console.log("Gabis Image file: ", zipFile);
        return zipFile;
     }
 
     findZipFile = (file) => {
         return file.type === "image";
     }

    setImages(){
        let images = [{
            original: 'http://lorempixel.com/1000/600/nature/1/',
            thumbnail: 'http://lorempixel.com/250/150/nature/1/',
        },
        {
            original: 'http://lorempixel.com/1000/600/nature/2/',
            thumbnail: 'http://lorempixel.com/250/150/nature/2/'
        },
        {
            original: 'http://lorempixel.com/1000/600/nature/3/',
            thumbnail: 'http://lorempixel.com/250/150/nature/3/'
        }
        ]   
        
        this.setState({images: images});
    }

    handleImageLoad(event) {
        console.log('Image loaded ', event.target)
    }

    render() {  
        const imageFiles = this.state.images;

        if (imageFiles != null && imageFiles.length > 0){      
            return ( < ImageGallery items = { imageFiles }
                                    slideInterval = { 2000 }
                                    onImageLoad = { this.handleImageLoad }
                                    showPlayButton = {false}
                    />
            );
        }
        else{
            return (<div>No Images found</div>);
        }
    }
}

export default Sketches;
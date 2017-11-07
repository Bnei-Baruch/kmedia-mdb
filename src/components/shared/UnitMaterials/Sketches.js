import "react-image-gallery/styles/css/image-gallery.css";
import ImageGallery from 'react-image-gallery';
import React from 'react';
import { isEmpty } from '../../../helpers/utils';
import PropTypes from 'prop-types';
import * as shapes from '../../shapes';
//import classNames from 'classnames';

class Sketches extends React.Component {
    static propTypes = {
        unit: shapes.ContentUnit.isRequired,
        t: PropTypes.func.isRequired,
        language: PropTypes.string.isRequired,
    }
    
    constructor(props){
        super(props);
        this.state = {images: []}
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
        this.setImages();
        const images = this.state.images;
        
        if (images.length > 0){      
            return ( < ImageGallery items = { images }
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
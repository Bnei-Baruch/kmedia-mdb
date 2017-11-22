import "react-image-gallery/styles/css/image-gallery.css";
import ImageGallery from 'react-image-gallery';
import React from 'react';
//import PropTypes from 'prop-types';
//import classNames from 'classnames';

class Sketches extends React.Component {

    handleImageLoad(event) {
        console.log('Image loaded ', event.target)
    }

    render() {
        const images = [{
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

        return ( < ImageGallery items = { images }
            slideInterval = { 2000 }
            onImageLoad = { this.handleImageLoad }
            showPlayButton = {false}
            />
        );
    }
}

export default Sketches;
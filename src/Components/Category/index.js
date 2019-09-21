import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {convertHexToRgba} from '../../Util/helpers';

class Category extends Component {

    static displayName = 'CategoryPage'

    static propTypes = {
        color: PropTypes.string.isRequired,
        images: PropTypes.arrayOf(PropTypes.shape({
            rectangle: PropTypes.bool.isRequired,
            url: PropTypes.string.isRequired
          })).isRequired,
        name: PropTypes.string.isRequired
    }

    formatErrorImage = ({target}) => {
        target.onerror = null;
        target.src = "https://via.placeholder.com/150x100/FFFFFF/000000?text=Image+expired";
        target.style.clipPath = 'none';
        target.style.width = '300px';
        target.style.height = '200px';
    };

    renderImages = () => {
        const {images, name} = this.props;
        return images.map(({rectangle, url}, index) => {
            const altName = name + '-' + url.slice(-5);
            return <img className='categoryImage' alt={altName} key={index} src={url} onError={this.formatErrorImage} style={{clipPath: rectangle ? 'none' : 'ellipse(50% 50%)'}}/>
        })
    }

    render() {
        const {color, name} = this.props;
        const backgroundColor = convertHexToRgba(color, 0.2);
        const squareColor = convertHexToRgba(color);
        
        return (
            <div className='categoryWrapper'>
                <div className='categoryHeader'>
                    <span className='categorySquare' style={{backgroundColor: squareColor}}/>{name}
                </div>
                <div className='imagesWrapper' style={{backgroundColor}}>
                    {this.renderImages()}
                </div>
            </div> 
        )
    }
}

export default Category
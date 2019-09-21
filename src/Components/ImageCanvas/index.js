import React, {Component} from 'react'
import ReactCrop from "react-image-crop";
import {generateColor} from '../../Util/helpers';
import "react-image-crop/dist/ReactCrop.css";

class ImageCanvas extends Component {
    static displayName = 'ImageCanvasPage'

    state = {
        basicRectangleOutline: true,
        categoryName: '',
        crop: null,
        croppedImageToBase64: '',
        croppedImageUrl: '',
        imageUrl: ''
    }

    componentDidMount() {
        if (localStorage.getItem('selectedImage')) {
            const imageUrl = localStorage.getItem('selectedImage');
            this.setState({imageUrl});
        }
    }

    backToGallery = () => this.props.history.push('/');

    changeCroppedOutline = shape => {
        const {basicRectangleOutline} = this.state;
        if (shape === 'toEllipse' && basicRectangleOutline) {
            this.setState({basicRectangleOutline: false});
        }
        if (shape === 'toRectangle' && !basicRectangleOutline) {
            this.setState({basicRectangleOutline: true});
        }
        return
    }   

    getCroppedImage(image, crop, fileName) {
        const canvas = document.createElement("canvas");
        canvas.width = crop.width;
        canvas.height = crop.height;
        const ctx = canvas.getContext("2d");
        const croppedImageToBase64 = canvas.toDataURL();

        ctx.drawImage(
          image,
          crop.x,
          crop.y,
          crop.width,
          crop.height,
          0,
          0,
          crop.width,
          crop.height
        );
        this.setState({croppedImageToBase64});
        return new Promise(resolve => {
          canvas.toBlob(blob => {
            if (!blob) return;
            blob.name = fileName;
            window.URL.revokeObjectURL(this.fileUrl);
            this.fileUrl = window.URL.createObjectURL(blob);
            resolve(this.fileUrl);
          }, "image/jpeg");
        });
    }

    makeClientCrop = async(crop) => {
        if (this.imageRef && crop.width && crop.height) {
          const croppedImageUrl = await this.getCroppedImage(
            this.imageRef,
            crop,
            "doesntMatter.jpeg"
          );
          this.setState({croppedImageUrl});
        }
    }

    onCropChange = crop => this.setState({crop});

    onImageLoaded = image => this.imageRef = image;

    saveCroppedImage = imageUrl => {
        const {basicRectangleOutline, categoryName} = this.state;
        const singleCategoryObj = {'color': generateColor(), 'name': categoryName, 'images': [{'url' : imageUrl, 'rectangle': basicRectangleOutline}]};

        if (!categoryName.length) {
            alert('Category name should not be an empty value');
            return;
        }
        if (localStorage.getItem('category')) {
            const savedCategories = JSON.parse(localStorage.getItem('category'));
            const doesCategoryExists = savedCategories.find(({name}) => name === categoryName);
            if (doesCategoryExists) {
                savedCategories.forEach(({images, name}) => {
                    if (name === categoryName) {
                        images.push({'url': imageUrl, 'rectangle': basicRectangleOutline});
                    } 
                })
            } else {
                savedCategories.push(singleCategoryObj);
            }
            try {
                localStorage.setItem('category', JSON.stringify(savedCategories));
              } catch (e) {
                if (e === 'QUOTA_EXCEEDED_ERR') {
                  alert('You cannot save more cropped images!');
                }
              }
        } else {
            const category = JSON.stringify([singleCategoryObj]);
            localStorage.setItem('category', category);
        }
        this.setState({categoryName: '', crop: {aspect: 1}, croppedImageToBase64: '', croppedImageUrl: ''});
        alert('Cropped image saved!');
        this.backToGallery();
    }

    setCategoryName = ({target: {name, value}}) => this.setState({[name]: value});

    render() {
        const {basicRectangleOutline, categoryName, crop, croppedImageUrl, croppedImageToBase64, imageUrl} = this.state;

        return (
            <div className='mainWrapper canvasWrapper'>
                <div className='header'>
                    <button className='btn btnBack' onClick={this.backToGallery}>Back to gallery</button>
                </div>
                <div className='canvasTitle'>
                    Image's title: <span style={{fontWeight: 'bold'}}>'{this.props.match.params.id}'</span>
                </div>
                <div className='canvasMainImage'>
                    <ReactCrop
                        circularCrop={!basicRectangleOutline}
                        src={imageUrl}
                        crop={crop}
                        maxWidht={750}
                        onImageLoaded={this.onImageLoaded}
                        onComplete={this.makeClientCrop}
                        onChange={this.onCropChange}
                    />
                </div>
                <div className='canvasButtons'>
                    <button className='btn' onClick={() => this.changeCroppedOutline('toEllipse')}>Elipse</button>
                    <button className='btn' onClick={() => this.changeCroppedOutline('toRectangle')}>Rectangle</button>
                </div>
                {!!croppedImageUrl && (
                    <div className='croppedImage'>
                        <div> 
                            {basicRectangleOutline ?
                                <img alt="Crop" style={{maxWidth: "100%"}} src={croppedImageUrl} /> :
                                <img alt="Crop" style={{maxWidth: "100%", borderRadius: '50%'}} src={croppedImageUrl} />
                            }    
                        </div>
                        <div style={{marginTop: 20}}>
                            <input className='categoryInput' type='text' name='categoryName' value={categoryName} onChange={this.setCategoryName} />
                            <button className='btn' onClick={() => this.saveCroppedImage(croppedImageUrl)}>Add to category and save temporary</button>
                            <button className='btn' onClick={() => this.saveCroppedImage(croppedImageToBase64)}>Add to category and save</button>
                        </div>
                    </div>)
                }
            </div>
        )
    }
}

export default ImageCanvas;
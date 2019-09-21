import React, {Component, Fragment} from 'react'
import {Link} from 'react-router-dom';
import {AVAILABLE_IMAGES, IMAGE_MAX_SIZE} from '../../Util/constants';
import {createArray} from '../../Util/helpers';

class Main extends Component {

  static displayName = 'MainPage'

  state = {
    file: null,
    imagePreviewUrl: '',
    images: []
  }

  componentDidMount() {
    this.uploadedImages = [];
    if (localStorage.getItem('uploadedImages')) {
      const images = this.getImageFromLocalStorage();
      this.setState({images});
    }
  }

  componentWillUnmount() {
    this.uploadedImages = [];
  }

  getImageFromLocalStorage = () => JSON.parse(localStorage.getItem('uploadedImages')) || []

  handleImageChange = ({target: {files}}) => {
    if (!files) return;
    const uploadedFile = files[0];
    this.reader = new FileReader();
    this.reader.onloadend = () => {
      if (uploadedFile.size < IMAGE_MAX_SIZE) {
        this.setState({
          file: uploadedFile,
          imagePreviewUrl: this.reader.result
        });
      } else {
        alert('You are trying to upload too big image!')
      }
    }
    uploadedFile && this.reader.readAsDataURL(uploadedFile);
  }

  handleSubmit = e => {
    e.preventDefault();
    const {file, imagePreviewUrl, images} = this.state;
    
    if (file) {
      const {name} = file;
      if (this.isImageInLocalStorage(name)) {
        window.alert('You are trying to load an existing image!');
        this.setState({file: '', imagePreviewUrl: ''});
        return;
      }
      if (file && imagePreviewUrl.length > 0) {
        const newUploadedImage = {name, imagePreviewUrl};
        const allImages = [...images, newUploadedImage];

        this.setState({file: '', imagePreviewUrl: '', images: allImages}, () => this.updateView());
        localStorage.setItem('uploadedImages', JSON.stringify(allImages));
      }
    }
  }

  isImageInLocalStorage = name => this.getImageFromLocalStorage().some(image => image.name === name);

  selectImage = imagePreviewUrl => localStorage.setItem('selectedImage', imagePreviewUrl);

  updateView = () => {
    if (localStorage.getItem('uploadedImages')) {
      const images = this.uploadedImages;
      images[images.length - 1].scrollIntoView();
    }
  }

  resetLocalStorage = () => {
    this.setState({images: []});
    localStorage.removeItem('uploadedImages');
  }

  renderBasicImages = () => {
    return (
      createArray(AVAILABLE_IMAGES).map((image, index) => {
        const staticName = 'random' + index;
        const staticUrl = `/images/people${image}.jpg`;
        return (
          <Link to={'/images/' + staticName} key={image} className='imageWrapper' onClick={() => this.selectImage(staticUrl)}>
            <img src={staticUrl} alt={staticName} style={{maxWidth: '100%'}} />
          </Link>
        )
      })
    )
  }

  renderForm = () => {
    return (
      <Fragment>
        <form onSubmit={(e)=>this.handleSubmit(e)} style={{marginTop: '20px'}}>
          <input 
            style={{display: 'none'}}
            ref={refInput => this.refInput = refInput}
            type="file" 
            accept="image/x-png,image/gif,image/jpeg"
            onChange={e => this.handleImageChange(e)} />
            <button className='btn' onClick={() => this.refInput.click()}>Choose image</button>
          <button className='btn' type="submit">Upload image</button>
        </form>
      </Fragment>
    )
  }

  renderLocalStorageImages = () => {
    const {images} = this.state;

    return images.length > 0 && images.map(({imagePreviewUrl, name}, index) => {
      const slicedName = name.split`.`[0];
        return <Link to={'/images/' + slicedName} key={index} className='imageWrapper' onClick={() => this.selectImage(imagePreviewUrl)}>
                <img src={imagePreviewUrl} alt={slicedName} ref={node => this.uploadedImages.push(node)} style={{maxWidth: '100%'}} />
              </Link>
    })
  }

  render() {
    return (
      <div className="mainWrapper">
        <div className='header'>
          <button className='btn' onClick={this.resetLocalStorage}>Remove added images</button>
          <Link to='/categories'>
            <button className='btn'>Categories</button>
          </Link>
        </div>
        <div className='imagesContainer'>
          {this.renderBasicImages()}
          {this.renderLocalStorageImages()}
        </div>
        {this.renderForm()}
      </div>
    );
  }
}

export default Main
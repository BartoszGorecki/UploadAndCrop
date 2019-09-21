import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import Category from '../Category';

class CategoriesView extends Component {

    state = {
        categories: []
    }

    componentDidMount() {
        const categories = JSON.parse(localStorage.getItem('category')) || [];
        this.setState({categories});
    }

    renderCategory = () => {
        const {categories} = this.state;
        if (!!categories.length) {
            return categories.map(({color, images, name}) => {
                return (
                    <Category key={name} color={color} images={images} name={name} />
                )
            });
        }
        return <div>No content to display. Crop any image to start with!</div>
    }

    render() {
        return (
            <div className='mainWrapper'>
                <div className='header'>
                    <Link to='/'>
                        <button className='btn'>Back to gallery</button>
                    </Link>
                </div>
                {this.renderCategory()}
            </div>
        )
    }
}

export default CategoriesView;
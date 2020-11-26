import React, { Component } from 'react'
import ProductCardContainer from '../product/productcardcontainer'
import NavBar from '../navigation/navbar'
import '../stylesheets/marketplace.css'

export class Marketplace extends Component {
    constructor(props) {
        super(props);
        this.state = {
            products: [
                {
                    img: '/assets/table1.jpg',
                    name: 'Table'
                },
                {
                    img: '/assets/chair1.jpg',
                    name: 'Chair'
                },
                {
                    img: '/assets/table1.jpg',
                    name: 'Table'
                },
                {
                    img: '/assets/chair1.jpg',
                    name: 'Chair'
                },
                {
                    img: '/assets/table1.jpg',
                    name: 'Table'
                },
                {
                    img: '/assets/chair1.jpg',
                    name: 'Chair'
                },
                {
                    img: '/assets/table1.jpg',
                    name: 'Table'
                },
                {
                    img: '/assets/chair1.jpg',
                    name: 'Chair'
                },
            ],
            
        };
    }

    componentDidMount() {
        // Get all items in the database and set state
    }

    render() {
        return (
            <div>
                <NavBar />
                <div className="marketplace-page">
                    <h3>MarketPlace</h3>
                    <ProductCardContainer products={this.state.products} />
                </div>
            </div>
        )
    }
}

export default Marketplace

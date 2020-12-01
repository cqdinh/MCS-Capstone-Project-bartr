import React, { Component } from 'react'
import ProductCardContainer from '../product/productcardcontainer'
import NavBar from '../navigation/navbar'
import '../stylesheets/marketplace.css'

import API from '../../api'


// Get all items from nearby users
async function getNearbyItems(longitude, latitude, distance_km){
    var nearby_users = await API.get("/users/nearby", {
        longitude: longitude, 
        latitude: latitude,
        distance_km: distance_km
    })
    nearby_users = nearby_users.data;

    var nearby_items = await API.get("/users/items_batch", {ids: nearby_users})
    return nearby_items
}

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

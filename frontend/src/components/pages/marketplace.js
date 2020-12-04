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
    return nearby_items.data
}

export class Marketplace extends Component {
    constructor(props) {
        super(props);
        this.state = {
            products: []
        };
    }

    componentDidMount() {
        // A user document pulled from the database. Intended to be the logged in user
        const user = this.props.user;
        
        /* Test Location{
            location: {
                coordinates: [22.22, 44.44]
            }   
        }*/

        // For now, default to 10 mile = 16 km range
        getNearbyItems(user.location.coordinates[0], user.location.coordinates[1], 16).then(
            items => {
                console.log("Items Loaded:", items.length)
                this.setState({products: items})
            }
        ).catch(err => console.log(err))
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

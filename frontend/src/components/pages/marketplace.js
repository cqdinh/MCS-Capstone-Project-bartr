import React, { Component } from 'react'
import ProductCardContainer from '../product/productcardcontainer'
import NavBar from '../navigation/navbar'
import '../stylesheets/marketplace.css'
import PropTypes from "prop-types";
import { connect } from "react-redux";

import API from '../../api'


// Get all items from nearby users
async function getNearbyItems(longitude, latitude, distance_km){
    var nearby_users = await API.get("users/nearby", {
        longitude: longitude, 
        latitude: latitude,
        distance_km: distance_km
    })
    let users = nearby_users.data;

    console.log("users", users)

    var nearby_items = await API.get("users/items_batch", {ids: users})
    return nearby_items.data
}

// Get all items from nearby users
async function getNearbyItemsWithoutUser(longitude, latitude, distance_km, excluded_user_id){
    var nearby_users = await API.get("users/nearby", {
        longitude: longitude, 
        latitude: latitude,
        distance_km: distance_km
    })

    
    const users = nearby_users.data.filter(x => (x !== excluded_user_id));

    console.log("users", users, nearby_users.data)

    var nearby_items = await API.get("users/items_batch", {ids: users})
    return nearby_items.data
}

async function getLocation(user_id){
    return API.get("users/location", {id: user_id})
}

export class Marketplace extends Component {
    constructor(props) {
        super(props);
        this.state = {
            products: []
        };
    }

    componentDidMount() {
        console.log(this.props)
        let auth = this.props.auth

        
        if (auth.isAuthenticated){
            const user = auth.user.id;
            getLocation(user).then(
                res => {
                    const coordinates = res.data;
                    console.log("coordinates", coordinates)
                    // For now, default to 10 mile = 16 km range
                    // Exclude the logged in user
                    getNearbyItemsWithoutUser(coordinates[0], coordinates[1], 16, user).then(
                        items => {
                            console.log("Items Loaded:", items.length)
                            this.setState({products: items})
                        }
                    ).catch(err => console.log(err))
                    // Get all items in the database and set state
                }
            )
        }
        else{
            const coordinates = [-117.84282, 33.64597]
            getNearbyItems(coordinates[0], coordinates[1], 16).then(
                items => {
                    console.log("Items Loaded:", items.length)
                    this.setState({products: items})
                }
            ).catch(err => console.log(err))
            // Get all items in the database and set state
        }
        
    }

    render() {
        console.log(this.props)
        return (
            <div>
                <NavBar />
                <div className="marketplace-page">
                    <h3>Marketplace</h3>
                    <ProductCardContainer products={this.state.products} ownedByUser={false} buttonMode={"preview"}/>
                </div>
            </div>
        )
    }
}

Marketplace.propTypes = {
    auth: PropTypes.object.isRequired,
  };
  const mapStateToProps = (state) => ({
    auth: state.auth,
  });
  export default connect(mapStateToProps, {})(Marketplace);

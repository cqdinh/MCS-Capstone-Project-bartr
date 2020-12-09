import React, { Component } from 'react'
import {Link, withRouter} from 'react-router-dom'
import ProductCardContainer from '../product/productcardcontainer'
import { Button } from 'react-bootstrap';
import NavBar from '../navigation/navbar'
import '../stylesheets/makeoffer.css'
import PropTypes from "prop-types";
import { connect } from "react-redux";

import API from '../../api'

function getUser(user_id) {
    return API.get("users/profile", { id: user_id });
}

function getItems(item_ids){
    return API.get("items/get", { ids: item_ids });
}

function createTrade(user1_id, user2_id, user1_items, user2_items){
    return API.post("trades/start", {
        initiator_id: user1_id,
        recipient_id: user2_id,
        initiator_items: user1_items,
        recipient_items: user2_items
    })
}

export class MakeOffer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentProduct: {},
            products: [],

            selectedProducts: {}
        };
    }

    componentDidMount() {
        // Get all user's items in the database and set state
        const product = this.props.location.state.product;
        this.setState({currentProduct: product});
        console.log(this.props)

        const userId = this.props.location.state.auth.user.id; // Get userId from props
        //console.log("Dashboard mount")
        //console.log(userId)

        getUser(userId).then(
            async res => {
                let profile = res.data;
                //console.log("profile", profile)

                if (profile.items.length !== 0){
                    const items_res = await getItems(profile.items)
                    const items = items_res.data

                    const selected_map = {}
                    items.forEach(item => {
                        selected_map[item._id] = false
                    })

                    this.setState({
                        products: items,
                        selectedProducts: selected_map
                    })
                }
            }
        )
    }


    selectProduct = (productId) => {
        var state_update = {selectedProducts: {}}
        state_update.selectedProducts[productId] = !this.state.selectedProducts[productId]

        this.setState(state_update)
    }

    handleSubmit = () => {
        var selected_items = []
        console.log(this.state.selectedProducts)

        for(const [item_id, is_selected] of Object.entries(this.state.selectedProducts)){
            if (is_selected){
                selected_items.push(item_id)
            }
        }

        if (selected_items.length === 0){
            alert("Please select a product");
            return;
        }

        createTrade(this.props.auth.user.id, this.state.currentProduct.user_id, selected_items, [this.state.currentProduct._id]).then(
            response => {
                alert("Offer Made")
                this.props.history.push("/marketplace");
            }
        ).catch(
            err => {
                alert("Error while creating offer")
            }
        )
    }

    render() {
        console.log("makeoffer props", this.props)
        return (
            <div>
                <NavBar />
                <div className="makeoffer-page">
                    <h3>Make an Offer</h3>
                    <h4>Select items to make a trade offer</h4>
                    <ProductCardContainer selected={this.state.selectedProducts} products={this.state.products} auth={this.props.location.state.auth} buttonMode={"select"} cardClick={this.selectProduct} ownedByUser={false}/>
                    <Button className="makeoffer-but" onClick={this.handleSubmit}>Make Offer</Button>
                </div>
            </div>
        )
    }
}

MakeOffer.propTypes = {
    auth: PropTypes.object.isRequired,
  };
  const mapStateToProps = (state) => ({
    auth: state.auth,
  });
  export default connect(mapStateToProps, {})(MakeOffer);
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

function counterTrade(trade_id, new_items, curr_status){
    return API.post("trades/counter", {
        id: trade_id,
        items: new_items,
        current_status: curr_status
    })
}

export class MakeOffer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentProduct: {},
            products: [],

            selectedProduct: undefined
        };
    }

    componentDidMount() {
        // Get all user's items in the database and set state
        const product = this.props.location.state.product;
        this.setState({currentProduct: product});
        console.log(this.props)

        const userId = this.props.auth.user.id; // Get userId from props
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
                        products: items
                    })
                }
            }
        )
    }


    selectProduct = (productId) => {
        this.setState({selectedProduct: productId})
    }

    handleSubmit = () => {

        if (!this.state.selectedProduct){
            alert("Please select a product");
            return;
        }

        if (this.props.location.state.is_counter){
            counterTrade(this.props.location.state.trade._id, [this.state.selectedProduct], this.props.location.state.trade.status).then(
                response => {
                    alert("Counter-Offer Made")
                    this.props.history.push("/marketplace");
                }
            ).catch(
                err => {
                    alert("Error while creating counter-offer")
                }
            )
        }
        else{
            createTrade(this.props.auth.user.id, this.state.currentProduct.user_id, [this.state.selectedProduct], [this.state.currentProduct._id]).then(
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
        
    }

    render() {
        console.log("makeoffer props", this.props)
        return (
            <div>
                <NavBar />
                <div className="makeoffer-page">
                    <h3>Make an Offer</h3>
                    <h4>Select an item to make a trade offer</h4>
                    <ProductCardContainer selected={this.state.selectedProduct} products={this.state.products} auth={this.props.location.state.auth} buttonMode={"select"} cardClick={this.selectProduct} ownedByUser={false}/>
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
import React, { Component } from 'react'
import { Button } from 'react-bootstrap';
import {Link, withRouter} from 'react-router-dom'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { ArrowLeftRight } from 'react-bootstrap-icons';
import Image from 'react-bootstrap/Image'
import '../stylesheets/offercard.css'

import PropTypes from "prop-types";
import { connect } from "react-redux";

import API from "../../api";

function getItems(item_ids){
    return API.get("items/get", { ids: item_ids });
}

function deleteTrade(trade_id){
    return API.post("trades/delete", {id: trade_id})
}

function acceptTrade(trade_id){
    console.log("Accept Trade")
    console.trace()
    return API.post("trades/accept", {id: trade_id})
}

function completeTrade(trade_id){
    return API.post("trades/complete", {id: trade_id})
}

function getUser(user_id) {
    return API.get("users/profile", { id: user_id });
}

class OfferCard extends Component {
    constructor(props) {
        super(props);
        console.log("offer card props", props)
        this.state = {
            product_a: {
                images: [undefined]
            },
            product_b: {
                images: [undefined]
            },

            other_user: {},

            user_is_a: false
        }
    }

    acceptOffer = (event) => {
        acceptTrade(this.props.trade._id).then(
            res => alert("Offer Accepted")
        )
    }

    deleteOffer = (event) => {
        deleteTrade(this.props.trade._id).then(
            res => alert("Offer Accepted")
        )
    }

    completeOffer = (event) => {
        completeTrade(this.props.trade._id).then(
            res => alert("Completed Trade")
        )
    }

    componentDidMount(){
        const trade = this.props.trade;

        getItems([trade.user1_items[0], trade.user2_items[0]]).then(
            res => {
                const items = res.data;

                this.setState({
                    product_a: items[0],
                    product_b: items[1],
                    user_is_a: (items[0].user_id === this.props.auth.user.id)
                })

                if(this.props.mode ==="accepted"){
                    if(this.state.user_is_a){
                        getUser(this.state.product_b.user_id).then(
                            res => {
                                this.setState({other_user: res.data})
                            }
                        )
                    }
                    else{
                        getUser(this.state.product_a.user_id).then(
                            res => {
                                this.setState({other_user: res.data})
                            }
                        )
                    }
                }
            }
        ).catch(
            err => console.log(err)
        )

        
    }

    render() {
        console.log("Offer Card");
        console.log(this.state);

        if (this.props.mode === "received"){
            return (
                <div className="offercard m-3">
                    <Row noGutters={true}>
                        <Col>
                            <Link to={{
                                pathname: "/productpreview",
                                state: {
                                    product: this.state.product_a,
                                    ownedByUser: this.state.user_is_a,
                                    auth: this.props.auth
                                }
                            }} className="link-button">
                                <Image src={this.state.product_a.images[0]} rounded alt="Product Image" className="offerprod-img" height="100px" width="125px"/>
                            </Link>
                            
                            <h6 className="offercard-prod-title">{this.state.product_a.name}</h6>
                        </Col>
                        <Col style={{padding: "35px 10px"}}>
                            <ArrowLeftRight />
                        </Col>
                        <Col>
                            <Link to={{
                                pathname: "/productpreview",
                                state: {
                                    product: this.state.product_b,
                                    ownedByUser: !this.state.user_is_a,
                                    auth: this.props.auth
                                }
                            }} className="link-button">
                                <Image src={this.state.product_b.images[0]} rounded alt="Product Image" className="offerprod-img" height="100px" width="125px"/>
                            </Link>
                            <h6 className="offercard-prod-title">{this.state.product_b.name}</h6>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Button variant="success" onClick={this.acceptOffer}>Accept</Button>
                        </Col>
                        <Col>
                            <Button variant="primary">
                                <Link to={{
                                    pathname: "/makeoffer",
                                    state: {
                                        is_counter: true, 
                                        trade: this.props.trade, 
                                        product: this.state.user_is_a ? 
                                            this.state.product_b : 
                                            this.state.product_a
                                    }
                                }} className="link-button">
                                Counter-offer
                            </Link>
                            </Button>
                        </Col>
                        <Col>
                            <Button variant="danger" onClick={this.deleteOffer}>Reject</Button>
                        </Col>
                    </Row>
                </div>
            )
        }
        else if (this.props.mode === "sent"){
            return (
                <div className="offercard m-3">
                    <Row noGutters={true}>
                        <Col>
                            <Link to={{
                                pathname: "/productpreview",
                                state: {
                                    product: this.state.product_a,
                                    ownedByUser: this.state.user_is_a,
                                    auth: this.props.auth
                                }
                            }} className="link-button">
                                <Image src={this.state.product_a.images[0]} rounded alt="Product Image" className="offerprod-img" height="100px" width="125px"/>
                            </Link>
                            
                            <h6 className="offercard-prod-title">{this.state.product_a.name}</h6>
                        </Col>
                        <Col style={{padding: "35px 10px"}}>
                            <ArrowLeftRight />
                        </Col>
                        <Col>
                            <Link to={{
                                pathname: "/productpreview",
                                state: {
                                    product: this.state.product_b,
                                    ownedByUser: !this.state.user_is_a,
                                    auth: this.props.auth
                                }
                            }} className="link-button">
                                <Image src={this.state.product_b.images[0]} rounded alt="Product Image" className="offerprod-img" height="100px" width="125px"/>
                            </Link>
                            <h6 className="offercard-prod-title">{this.state.product_b.name}</h6>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Button variant="primary">
                                <Link to={{
                                    pathname: "/makeoffer",
                                    state: {
                                        is_counter: true, 
                                        trade: this.props.trade, 
                                        product: this.state.user_is_a ? 
                                            this.state.product_b : 
                                            this.state.product_a
                                    }
                                }} className="link-button">
                                    Modify
                                </Link>
                            </Button>
                        </Col>
                        <Col>
                            <Button variant="danger" onClick={this.deleteOffer}>Cancel</Button>
                        </Col>
                        <Col></Col>
                    </Row>
                </div>
            )
        }
        else if (this.props.mode === "accepted"){
            return (
                <div className="offercard m-3">
                    <Row noGutters={true}>
                        <Col>
                            <Link to={{
                                pathname: "/productpreview",
                                state: {
                                    product: this.state.product_a,
                                    ownedByUser: this.state.user_is_a,
                                    auth: this.props.auth
                                }
                            }} className="link-button">
                                <Image src={this.state.product_a.images[0]} rounded alt="Product Image" className="offerprod-img" height="100px" width="125px"/>
                            </Link>
                            
                            <h6 className="offercard-prod-title">{this.state.product_a.name}</h6>
                        </Col>
                        <Col style={{padding: "35px 10px"}}>
                            <ArrowLeftRight />
                        </Col>
                        <Col>
                            <Link to={{
                                pathname: "/productpreview",
                                state: {
                                    product: this.state.product_b,
                                    ownedByUser: !this.state.user_is_a,
                                    auth: this.props.auth
                                }
                            }} className="link-button">
                                <Image src={this.state.product_b.images[0]} rounded alt="Product Image" className="offerprod-img" height="100px" width="125px"/>
                            </Link>
                            <h6 className="offercard-prod-title">{this.state.product_b.name}</h6>
                        </Col>
                    </Row>
                    <Row noGutters={true}>
                        <h6 className="offercard-prod-title">Email: {this.state.other_user.email}</h6>
                        
                    </Row>
                    <Row noGutters={true}>
                        <h6 className="offercard-prod-title">Phone: {this.state.other_user.phone}</h6>
                    </Row>
                    <Row>
                        <Col>
                            <Button variant="success" onClick={this.completeOffer}>Complete</Button>
                        </Col>
                        <Col>
                            <Button variant="primary">
                                <Link to={{
                                    pathname: "/makeoffer",
                                    state: {
                                        is_counter: true, 
                                        trade: this.props.trade, 
                                        product: this.state.user_is_a ? 
                                            this.state.product_b : 
                                            this.state.product_a
                                    }
                                }} className="link-button">
                                    Modify
                                </Link>
                            </Button>
                        </Col>
                        <Col>
                            <Button variant="danger" onClick={this.deleteOffer}>Cancel</Button>
                        </Col>
                    </Row>
                </div>
            )
        }
    }
}

OfferCard.propTypes = {
    auth: PropTypes.object.isRequired,
  };
  const mapStateToProps = (state) => ({
    auth: state.auth,
  });
  export default connect(mapStateToProps, {})(OfferCard);
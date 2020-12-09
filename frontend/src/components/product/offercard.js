import React, { Component } from 'react'
import { Button } from 'react-bootstrap';
import {Link, withRouter} from 'react-router-dom'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { ArrowLeftRight } from 'react-bootstrap-icons';
import Image from 'react-bootstrap/Image'
import '../stylesheets/offercard.css'

import API from "../../api";

function getItems(item_ids){
    return API.get("items/get", { ids: item_ids });
}

function deleteTrade(trade_id){
    return API.post("trades/delete", {id: trade_id})
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
            }
        }
    }

    makeOffer(){
        this.props.history.push("/makeoffer/" + this.props.product.offerprodId);
    }

    deleteOffer = (event) => {
        deleteTrade(this.props.trade._id).then(
            res => alert("offer deleted")
        )
    }

    componentDidMount(){
        const trade = this.props.trade;

        getItems([trade.user1_items[0], trade.user2_items[0]]).then(
            res => {
                const items = res.data;

                this.setState({
                    product_a: items[0],
                    product_b: items[1]
                })
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
                            <Image src={this.state.product_a.images[0]} rounded alt="Product Image" className="offerprod-img" height="100px" width="125px"/>
                            <h6 className="offercard-prod-title">{this.state.product_a.name}</h6>
                        </Col>
                        <Col style={{padding: "35px 10px"}}>
                            <ArrowLeftRight />
                        </Col>
                        <Col>
                            <Image src={this.state.product_b.images[0]} rounded alt="Product Image" className="offerprod-img" height="100px" width="125px"/>
                            <h6 className="offercard-prod-title">{this.state.product_b.name}</h6>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Button variant="success">Accept</Button>
                        </Col>
                        <Col>
                            <Button variant="primary" onClick={this.makeOffer}>Counter</Button>
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
                            <Image src={this.state.product_a.images[0]} rounded alt="Product Image" className="offerprod-img" height="100px" width="125px"/>
                            <h6 className="offercard-prod-title">{this.state.product_a.name}</h6>
                        </Col>
                        <Col style={{padding: "35px 10px"}}>
                            <ArrowLeftRight />
                        </Col>
                        <Col>
                            <Image src={this.state.product_b.images[0]} rounded alt="Product Image" className="offerprod-img" height="100px" width="125px"/>
                            <h6 className="offercard-prod-title">{this.state.product_b.name}</h6>
                        </Col>
                    </Row>
                    <Row>
                        <Col></Col>
                        <Col>
                            <Button variant="danger" onClick={this.deleteOffer}>Cancel</Button>
                        </Col>
                        <Col></Col>
                    </Row>
                </div>
            )
        }
        
    }
}

export default withRouter(OfferCard);

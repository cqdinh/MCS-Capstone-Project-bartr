import React, { Component } from 'react'
import { Button } from 'react-bootstrap';
import {Link, withRouter} from 'react-router-dom'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { ArrowLeftRight } from 'react-bootstrap-icons';
import Image from 'react-bootstrap/Image'
import '../stylesheets/offercard.css'

class OfferCard extends Component {
    constructor(props) {
        super(props);
    }

    makeOffer = () => {
        this.props.history.push("/makeoffer/" + this.props.product.offerprodId);
    }

    render() {
        const { product } = this.props;
        console.log("Offer Card");
        console.log(product);
        return (
            <div className="offercard m-3">
                <Row noGutters={true}>
                    <Col>
                        <Image src={window.location.origin + product.myprodImg} rounded alt="Product Image" className="offerprod-img" height="100px" width="125px"/>
                        <h6 className="offercard-prod-title">{product.myprodName}</h6>
                    </Col>
                    <Col style={{padding: "35px 10px"}}>
                        <ArrowLeftRight />
                    </Col>
                    <Col>
                        <Image src={window.location.origin + product.offerprodImg} rounded alt="Product Image" className="offerprod-img" height="100px" width="125px"/>
                        <h6 className="offercard-prod-title">{product.offerprodName}</h6>
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
                        <Button variant="danger">Reject</Button>
                    </Col>
                </Row>
            </div>
        )
    }
}

export default withRouter(OfferCard);

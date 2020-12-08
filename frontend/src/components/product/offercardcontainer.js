import React, { Component } from 'react'
import Row from 'react-bootstrap/Row'
import OfferCard from './offercard'


export class OfferCardContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {            
            
        };
    }
    render() {
        return (
            <Row noGutters={true} className="ml-3">
                {this.props.products.map((product, index) =>
                    <OfferCard product={product} key={index}></OfferCard>
                )}                                        
            </Row>
        )
    }
}

export default OfferCardContainer

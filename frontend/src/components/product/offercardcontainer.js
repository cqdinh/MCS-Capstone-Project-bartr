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
                {this.props.trades.map((trade, index) =>
                    <OfferCard mode={this.props.mode} trade={trade} key={index}></OfferCard>
                )}                                        
            </Row>
        )
    }
}

export default OfferCardContainer

import React, { Component } from 'react'
import Row from 'react-bootstrap/Row'
import ProductCard from './productcard'


export class ProductCardContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {            
            
        };
    }
    render() {
        if(this.props.pageId == 1)
            return (
                <Row noGutters={true} className="ml-3">
                    {this.props.products.map((product, index) =>
                        <ProductCard product={product} key={index} tempClick={this.props.cardClick} pageId={this.props.pageId}></ProductCard>
                    )}                                        
                </Row>
            )
        else 
            return (
                <Row noGutters={true} className="ml-3">
                    {this.props.products.map((product, index) =>
                        <ProductCard product={product} key={index} tempClick={() => console.log("MarketPlace Page Product")} pageId={this.props.pageId}></ProductCard>
                    )}                                        
                </Row>
            )
    }
}

export default ProductCardContainer

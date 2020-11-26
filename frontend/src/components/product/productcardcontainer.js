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
        return (
            <Row noGutters={true} className="ml-3">
                {this.props.products.map((product, index) =>
                    <ProductCard product={product} key={index}></ProductCard>
                )}                                        
            </Row>
        )
    }
}

export default ProductCardContainer

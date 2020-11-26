import React, { Component } from 'react'
import { Button } from 'react-bootstrap';
import {Link} from 'react-router-dom'
import Image from 'react-bootstrap/Image'
import '../stylesheets/productcard.css'

export default class ProductCard extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { product } = this.props;
        
        return (
            <div className="product-card m-3">
                <div className="product-img">
                    <Image src={window.location.origin + product.img} rounded alt="Product Image" className="" height="100px" width="125px"/>
                </div>
                <div className="product-desc">
                    <h6 className="product-title">{product.name}</h6>                    
                </div>
                <div className="button-div">
                    {/* Onclick redirect to Product Preview Page with ProductId */}
                    <Button size="sm" className="view-product-but">View Details</Button>
                </div>
            </div>
        )
    }
}

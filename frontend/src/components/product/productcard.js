import React, { Component } from 'react'
import { Button } from 'react-bootstrap';
import {Link, withRouter} from 'react-router-dom'
import Image from 'react-bootstrap/Image'
import '../stylesheets/productcard.css'

class ProductCard extends Component {
    constructor(props) {
        super(props);
    }

    click = () => {
        this.props.tempClick(this.props.product.id);
        console.log("product card clicked")
    }

    prodPrev = () => {
        this.props.history.push("/productpreview/" + this.props.product.id);
    }

    render() {
        const { product } = this.props;
        if(this.props.pageId == 1)
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
                        <Button size="sm" className="view-product-but" onClick={this.click}>Select</Button>
                    </div>
                </div>
            )
        else 
            return (
                <div className="product-card m-3">
                    <div className="product-img">
                    <Image src={product.img} rounded alt="Product Image" className="" height="100px" width="125px"/>
                    </div>
                    <div className="product-desc">
                        <h6 className="product-title">{product.name}</h6>                    
                    </div>
                    <div className="button-div">
                        {/* Onclick redirect to Product Preview Page with ProductId */}
                        <Button size="sm" className="view-product-but" onClick={this.prodPrev}>View Details</Button>
                    </div>
                </div>
            )
    }
}

export default withRouter(ProductCard);

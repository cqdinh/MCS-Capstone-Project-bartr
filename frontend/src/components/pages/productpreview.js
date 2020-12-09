import React, { Component } from 'react'
import ImageContainer from '../product/imagecontainer';
import {Link, withRouter} from 'react-router-dom'
import NavBar from '../navigation/navbar'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Image from 'react-bootstrap/Image'
import Button from 'react-bootstrap/Button'
import StarRatingComponent from 'react-star-rating-component';
import '../stylesheets/productpreview.css'

import API from '../../api'

function getName(user_id){
    return API.get('users/name', {
        id: user_id
    });
}

export class ProductPreview extends Component {
    constructor(props) {
        super(props);
        console.log("Product Preview Properties", props)
        this.state = {
            seller_name: ""
        };
    }

    componentDidMount() {
        console.log(this.props)

        getName(this.props.location.state.product.user_id).then(
            res => {
                this.setState({seller_name: res.data})
            }
        )
        // Get product details from Product Id and set State
    }

    makeOffer = () => {
        this.props.history.push("/makeoffer/" + this.state.productId);
    }

    render() {
        const product = this.props.location.state.product;
        console.log(this.state.product)
        if (this.props.location.state.ownedByUser){
            return (
                <div>
                    <NavBar />
                    <Row noGutters={true} className="product-preview-page">
                        <Col xs={12} md={6} className="product-images">
                            <Row noGutters={true} className="ml-3 justify-content-center">
                                <Image src={product.images[0]} thumbnail alt="Product Image" className="profile-img"/>
                            </Row>
                            
                            <ImageContainer images={product.images}/>

                            
                        </Col>
                        <Col xs={12} md={6} className="product-desc">                    
                            
                            <h3>Item Info: </h3>
                            <p>Product Name : {product.name}</p>
                            <p>Description : {product.description}</p>
                            <p>Seller Name : {this.state.seller_name}</p>

                            {/* Only show the Make an Offer button if the item isn't owned by the current user */}
                            
                        </Col>
                    </Row>
                    
                </div>
            )
        }
        else{
            return (
                <div>
                    <NavBar />
                    <Row noGutters={true} className="product-preview-page">
                        <Col xs={12} md={6} className="product-images">
                            <Row noGutters={true} className="ml-3 justify-content-center">
                                <Image src={product.images[0]} thumbnail alt="Product Image" className="profile-img"/>
                            </Row>                       
                            
                            <ImageContainer images={product.images}/>
                        </Col>
                        <Col xs={12} md={6} className="product-desc">                    
                            
                            <h3>Item Info: </h3>
                            <p>Product Name : {product.name}</p>
                            <p>Description : {product.description}</p>
                            <p>Seller Name : {this.state.seller_name}</p>
                            
                            <Row noGutters={true} className="justify-content-center">
                                {/* Redirect to Select Products from User's Items and Pass ProductId */}
                                <Button variant="primary" type="submit" className="pl-3 pr-3">
                                    <Link to={{
                                        pathname: "/makeoffer",
                                        state: {
                                            product: product,
                                            auth: this.props.location.state.auth
                                        }
                                    }} className="link-button">Make An Offer</Link>
                                </Button>
                            </Row>
                            
                        </Col>
                    </Row>
                    
                </div>
            )
        }
    }
}

export default withRouter(ProductPreview)

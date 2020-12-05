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

function getItem(item_id){
    return API.get('items/get_one', {
        id: item_id
    });
}

export class ProductPreview extends Component {
    constructor(props) {
        super(props);
        this.state = {
            product: {                
                img: ['/assets/table1.jpg', '/assets/chair1.jpg'],
                name: 'Table',
                desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla ultrices fermentum ipsum quis feugiat. Proin eu sem nec velit suscipit aliquet. Sed scelerisque eros a varius euismod. Sed tincidunt metus a mattis ultrices. Aenean auctor sed ipsum eget dictum. Fusce ut laoreet mi. Nunc lacinia imperdiet tellus, sed hendrerit nulla pretium vel.",
                seller: 'Parth Shah',
            },
            
            productId: 0,
        };
    }

    componentDidMount() {
        const {productNum} = this.props.match.params;
        this.setState({productId: productNum});
        console.log(productNum);

        // Get product details from Product Id and set State
    }

    makeOffer = () => {
        this.props.history.push("/makeoffer/" + this.state.productId);
    }

    render() {
        return (
            <div>
                <NavBar />
                <Row noGutters={true} className="product-preview-page">
                    <Col xs={12} md={6} className="product-images">
                        <Row noGutters={true} className="ml-3 justify-content-center">
                            <Image src={window.location.origin + this.state.product.img[0]} thumbnail alt="Product Image" className="profile-img"/>
                        </Row>                       
                        
                        <ImageContainer images={this.state.product.img}/>
                    </Col>
                    <Col xs={12} md={6} className="product-desc">                    
                        
                            <h3>Item Info: </h3>
                            <p>Product Name : {this.state.product.name}</p>
                            <p>Description : {this.state.product.desc}</p>
                                                   
                        
                            <h3>Seller Info:</h3>
                            <p>Seller Name : {this.state.product.seller}</p>
                            <p>Rating: </p>
                            <StarRatingComponent 
                            name="Rating" 
                            starCount={5}
                            value={3.5}
                            className="ml-3"
                            />
                            <p></p>
                        
                        
                        <Row noGutters={true} className="justify-content-center">
                            {/* Redirect to Select Products from User's Items and Pass ProductId */}
                            <Button variant="primary" onClick={this.makeOffer} className=" pl-3 pr-3">
                                Make an Offer
                            </Button>
                        </Row>
                        
                    </Col>
                </Row>
                
            </div>
        )
    }
}

export default withRouter(ProductPreview)

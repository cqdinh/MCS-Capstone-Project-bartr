import React, { Component } from 'react'
import {Link, withRouter} from 'react-router-dom'
import ProductCardContainer from '../product/productcardcontainer'
import { Button } from 'react-bootstrap';
import NavBar from '../navigation/navbar'
import '../stylesheets/makeoffer.css'

import API from '../../api'

export class MakeOffer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            products: [
                {
                    id: 1,
                    img: '/assets/table1.jpg',
                    name: 'Table'
                },
                {
                    id: 2,
                    img: '/assets/chair1.jpg',
                    name: 'Chair'
                },
                {
                    id: 3,
                    img: '/assets/table1.jpg',
                    name: 'Table'
                },
                
            ],

            currentProduct: -1,
            selectedProduct: 0,
            
        };
    }

    componentDidMount() {
        // Get all user's items in the database and set state
        const {productNum} = this.props.match.params;
        this.setState({currentProduct: productNum});
        console.log(productNum);
    }


    selectProduct = (productId) => {
        this.setState({selectedProduct: productId}, () => console.log(this.state.selectedProduct));
        console.log("In make offer card clicked" + productId);
    }

    handleSubmit = () => {
        if(this.state.selectedProduct != 0) {
            console.log(this.state.selectedProduct);
            // Make post request to store offer details
            this.props.history.push("/marketplace");
        }
        else {
            alert("Please select a product");
        }        
    }

    render() {
        return (
            <div>
                <NavBar />
                <div className="makeoffer-page">
                    <h3>Make an Offer</h3>
                    <h4>Select one item to make a trade offer</h4>
                    <ProductCardContainer products={this.state.products} cardClick={this.selectProduct} pageId={1}/>
                    <Button className="makeoffer-but" onClick={this.handleSubmit}>Make Offer</Button>
                </div>
            </div>
        )
    }
}

export default withRouter(MakeOffer)

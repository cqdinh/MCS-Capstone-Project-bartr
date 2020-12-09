import React, { Component } from 'react'
import { Button } from 'react-bootstrap';
import {Link, withRouter} from 'react-router-dom'
import Image from 'react-bootstrap/Image'
import '../stylesheets/productcard.css'
import PropTypes from "prop-types";
import { connect } from "react-redux";

class ProductCard extends Component {
    constructor(props) {
        super(props);
        if (this.props.buttonMode === 'select'){
            this.state = {
                selected: false
            }
        }
    }

    click = (event) => {
        event.preventDefault()
        this.props.tempClick(this.props.product._id);
        this.setState({
            selected: !this.state.selected
        })

        console.log("product card clicked")
    }

    prodPrev = () => {
        this.props.history.push("/productpreview/", this.props.product);
    }

    render() {
        const { product } = this.props;
        console.log(this.props)
        if(this.props.buttonMode === "select") {
            return (
                <div onClick={this.click} className={"m-3 " + (this.props.selected[product._id] ? "product-card-selected" : "product-card")}>
                    <div className="product-img">
                        <Image src={product.images[0]} rounded alt="Product Image" className="" height="100px" width="125px"/>
                    </div>
                    <div className="product-desc">
                        <h6 className="product-title">{product.name}</h6>                    
                    </div>
                    <div className="button-div">
                        {/*<Button size="sm" className="view-product-but" >Select</Button>*/}
                    </div>
                </div>
            )
            } else if(this.props.buttonMode === "preview") {
                return (
                    <div className="product-card m-3">
                        <div className="product-img">
                        <Image src={product.images[0]} rounded alt="Product Image" className="" height="100px" width="125px"/>
                        </div>
                        <div className="product-desc">
                            <h6 className="product-title">{product.name}</h6>                    
                        </div>
                        <div className="button-div">
                            
                        {/* Onclick redirect to Product Preview Page*/}
                        <Button variant="primary" type="submit" className="">
                            <Link to={{
                                pathname: "/productpreview",
                                state: {
                                    product: product,
                                    ownedByUser: this.props.ownedByUser,
                                    auth: this.props.auth
                                }
                            }} className="link-button">Item Preview</Link>
                        </Button>
                        </div>
                    </div>
                )
            }
    }
}

ProductCard.propTypes = {
    auth: PropTypes.object.isRequired,
  };
  const mapStateToProps = (state) => ({
    auth: state.auth,
  });
  export default connect(mapStateToProps, {})(ProductCard);
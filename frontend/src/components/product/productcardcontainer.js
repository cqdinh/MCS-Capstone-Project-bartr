import React, { Component } from 'react'
import Row from 'react-bootstrap/Row'
import ProductCard from './productcard'
import PropTypes from "prop-types";
import { connect } from "react-redux";

export class ProductCardContainer extends Component {
    constructor(props) {
        super(props);
        //console.log(props)
        this.state = {            
            
        };
    }
    render() {
        return (
            <Row noGutters={true} className="ml-3">
                {this.props.products.map((product, index) =>
                    <ProductCard selected={this.props.selected} product={product} key={index} buttonMode={this.props.buttonMode} tempClick={this.props.cardClick} ownedByUser={this.props.ownedByUser}></ProductCard>
                )}
            </Row>
        )
    }
}

ProductCardContainer.propTypes = {
    auth: PropTypes.object.isRequired,
  };
  const mapStateToProps = (state) => ({
    auth: state.auth,
  });
  export default connect(mapStateToProps, {})(ProductCardContainer);

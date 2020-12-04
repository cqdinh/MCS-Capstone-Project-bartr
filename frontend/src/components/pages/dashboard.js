import React, { Component } from "react";
import { Link } from "react-router-dom";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Image from "react-bootstrap/Image";
import NavBar from "../navigation/navbar";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import ProductCardContainer from "../product/productcardcontainer";
import { withRouter } from "react-router-dom";

import PropTypes from "prop-types";
import { connect } from "react-redux";
import { logoutUser } from "../../actions/authActions";

import "../stylesheets/dashboard.css";

import API from "../../api";

function getUser(user_id) {
  return API.get("/users/profile", { id: user_id });
}

class dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      myitems: [
        {
          img: "/assets/table1.jpg",
          name: "Table",
        },
        {
          img: "/assets/chair1.jpg",
          name: "Chair",
        },
      ],

      ongoing: [
        {
          img: "/assets/table1.jpg",
          name: "Table",
        },
      ],

      past: [
        {
          img: "/assets/chair1.jpg",
          name: "Chair",
        },
      ],

      name: "Parth Shah",
      address: "3801 Parkview Lane, Irvine, CA - 12312",
      phoneNo: "21232435665",
      email: "parth@gmail.com",
    };
  }

  onLogoutClick = (e) => {
    e.preventDefault();
    this.props.logoutUser();
  };

  componentDidMount() {
    // const {userId} = this.props.match.params; // Get userId from props
    // Use userId to get user details, products and set state
    // If userId does not exist in databse redirect to landing page
    // If logged in and user navigates to Register page, should redirect them to dashboard
    if (!this.props.auth.isAuthenticated) {
      this.props.history.push("/");
    }
  }

  render() {
    const { user } = this.props.auth;
    return (
      <div>
        <NavBar />
        <Row noGutters={true}>
          <Col xs={12} md={5} className="dashboard-profile">
            <Row noGutters={true} className="d-flex justify-content-center">
              <Image
                src={window.location.origin + "/assets/noimage.jpg"}
                roundedCircle
                alt="Profile Photo"
                className="profile-img"
              />
            </Row>
            <Row
              noGutters={true}
              className="d-flex justify-content-center user-name"
            >
              <h3>{user.display_name}</h3>
            </Row>
            <Container>
              <Row noGutters={true} className="user-details">
                <h6>
                  <b>Phone No:</b> {user.phone}
                </h6>
              </Row>
              <Row noGutters={true} className="user-details">
                <h6>
                  <b>Email:</b> {user.email}
                </h6>
              </Row>
            </Container>
            <Button variant="primary" type="submit" className="m-3 pl-3 pr-3">
              {/* Non Functional for now */}
              Edit
            </Button>
          </Col>
          <Col xs={12} md={7} className="user-collections">
            <Row noGutters={true} className="d-flex justify-content-end m-3">
              <Button variant="primary" type="submit" className="">
                <Link to="/additem" className="link-button">
                  Add a New Item
                </Link>
              </Button>
            </Row>
            <h3 className="ml-3">My Items:</h3>
            <ProductCardContainer products={this.state.myitems} />
            <h3 className="ml-3">Ongoing Offers:</h3>
            <ProductCardContainer products={this.state.ongoing} />
            <h3 className="ml-3">Past Transactions:</h3>
            <ProductCardContainer products={this.state.past} />
          </Col>
        </Row>
        <button
          style={{
            width: "150px",
            borderRadius: "3px",
            letterSpacing: "1.5px",
            marginTop: "1rem",
          }}
          onClick={this.onLogoutClick}
          className="btn btn-large"
        >
          Logout
        </button>
      </div>
    );
  }
}

//export default withRouter(dashboard);

dashboard.propTypes = {
  logoutUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
};
const mapStateToProps = (state) => ({
  auth: state.auth,
});
export default connect(mapStateToProps, { logoutUser })(dashboard);

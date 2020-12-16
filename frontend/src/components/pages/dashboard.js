import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Image from "react-bootstrap/Image";
import NavBar from "../navigation/navbar";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import ProductCardContainer from "../product/productcardcontainer";
import OfferCardContainer from "../product/offercardcontainer";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { logoutUser } from "../../actions/authActions";

import "../stylesheets/dashboard.css";

import API from "../../api";

function getUser(user_id) {
  return API.get("users/profile", { id: user_id });
}

function getItems(item_ids) {
  return API.get("items/get", { ids: item_ids });
}

function getReceivedTrades(user_id) {
  return API.get("trades/get_received", { id: user_id });
}

function getSentTrades(user_id) {
  return API.get("trades/get_sent", { id: user_id });
}

function getAcceptedTrades(user_id) {
  return API.get("trades/get_accepted", { id: user_id });
}

class dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      myitems: [],

      profile: {},

      sent: [],
      received: [],
      accepted: [],

      name: "",
      phone: "",
      email: "",
      profilePicture: "",

      should_reload: false,
    };
  }

  onLogoutClick = (e) => {
    e.preventDefault();
    this.props.logoutUser();
  };

  componentDidMount() {
    // Use userId to get user details, products and set state
    // If userId does not exist in databse redirect to landing page
    // If logged in and user navigates to Register page, should redirect them to dashboard
    if (!this.props.auth.isAuthenticated) {
      this.props.history.push("/");
    }
    //console.log("User")
    //console.log(this.props.auth);

    //console.log("Dashboard mount")
    //console.log(userId)
    this.load_data();

    // Update every 5 seconds to include added items
    this.interval = setInterval(this.load_data.bind(this), 5000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  load_data() {
    const userId = this.props.auth.user.id; // Get userId from props
    getUser(userId).then(async (res) => {
      let profile = res.data;
      //console.log("profile", profile)
      this.setState({ profile: profile });
      if (profile.items.length !== 0) {
        let items = await getItems(profile.items);
        this.setState({
          myitems: items.data,
        });

        if (profile.curr_trades.length !== 0) {
          let received = await getReceivedTrades(profile._id);
          let sent = await getSentTrades(profile._id);
          let accepted = await getAcceptedTrades(profile._id);
          console.log("Accepted Result", accepted.data);
          this.setState({
            sent: sent.data,
            received: received.data,
            accepted: accepted.data,
          });
        }
      }

      this.setState({
        name: profile.display_name,
        phone: profile.phone,
        email: profile.email,
        profilePicture: profile.profilePicture,
      });
    });
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
                src={this.state.profilePicture}
                roundedCircle
                alt="Profile Photo"
                className="profile-img"
              />
            </Row>
            <Row
              noGutters={true}
              className="d-flex justify-content-center user-name"
            >
              <h3>{this.state.name}</h3>
            </Row>
            <Container>
              <Row noGutters={true} className="user-details">
                <h6>
                  <b>Phone No: {this.state.phone} </b>
                </h6>
              </Row>
              <Row noGutters={true} className="user-details">
                <h6>
                  <b>Email: {this.state.email} </b>
                </h6>
              </Row>
            </Container>
            <Button variant="primary" type="submit" className="m-3 pl-3 pr-3">
              <Link
                to={{
                  pathname: "/dashboard/edit",
                  state: {
                    user: this.state.profile,
                  },
                }}
                className="link-button"
              >
                Edit
              </Link>
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
            <ProductCardContainer
              products={this.state.myitems}
              buttonMode={"preview"}
              ownedByUser={true}
            />
            <h3 className="ml-3">Received Offers:</h3>
            <OfferCardContainer mode="received" trades={this.state.received} />
            <h3 className="ml-3">Sent Offers:</h3>
            <OfferCardContainer mode="sent" trades={this.state.sent} />
            <h3 className="ml-3">Accepted Offers:</h3>
            <OfferCardContainer mode="accepted" trades={this.state.accepted} />
          </Col>
        </Row>
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

import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import NavBar from "../navigation/navbar";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Image from "react-bootstrap/Image";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import ImageUploader from "react-images-upload";
import classnames from "classnames";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { updateUser } from "../../actions/authActions";

import "../stylesheets/signup.css";

import API from "../../api";

export class Edit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      display_name: "",
      email: "",
      phone: "",
      password: "",
      password2: "",
      errors: {},
      coordinates: {
        latitude: 34,
        longitude: -118,
      },
    };
  }

  componentDidMount() {
    // const {userId} = this.props.match.params; // Get userId from props
    // Use userId to get user details, products and set state
    // If userId does not exist in databse redirect to landing page
    // If logged in and user navigates to Register page, should redirect them to dashboard
    if (!this.props.auth.isAuthenticated) {
      this.props.history.push("/");
    }
    console.log("User");
    console.log(this.props.auth.user);
    this.setState({
      display_name: this.props.auth.user.display_name,
      email: this.props.auth.user.email,
      phone: this.props.auth.user.phone,
    });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.errors) {
      this.setState({
        errors: nextProps.errors,
      });
    }
  }

  handleChange = ({ target }) => {
    this.setState({ [target.name]: target.value });
  };

  onDrop = (picture) => {
    this.setState({
      pictures: this.state.pictures.concat(picture),
    });
  };

  handleSubmit = (event) => {
    event.preventDefault();

    console.log(this.state.email);
    console.log(this.state.password);
    console.log(this.state.password2);
    console.log(this.state.display_name);

    const newUser = {
      display_name: this.state.display_name,
      email: this.state.email,
      password: this.state.password,
      password2: this.state.password2,
      longitude: this.state.coordinates.longitude,
      latitude: this.state.coordinates.latitude,
      phone: this.state.phone,
    };
    console.log(newUser);
    this.props.updateUser(newUser, this.props.history);
  };

  render() {
    const { errors } = this.state;
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
              <h3>{this.state.display_name}</h3>
            </Row>
            <Container>
              <Row noGutters={true} className="user-details">
                <h6>
                  <b>Phone No:</b> {this.state.phone}
                </h6>
              </Row>
              <Row noGutters={true} className="user-details">
                <h6>
                  <b>Email:</b> {this.state.email}
                </h6>
              </Row>
            </Container>
          </Col>
          <Col xs={12} md={7} className="p-3">
            <Form noValidate onSubmit={this.handleSubmit}>
              <Form.Group controlId="formGridName">
                <Form.Label>Name :</Form.Label>
                <Form.Control
                  name="display_name"
                  type="text"
                  value={this.state.display_name}
                  onChange={this.handleChange}
                  placeholder="Full Name"
                  className={classnames("", {
                    invalid: errors.display_name,
                  })}
                  required
                />
              </Form.Group>
              <span style={{ color: "red" }}>{errors.display_name}</span>
              <Form.Group controlId="formGridPhone">
                <Form.Label>Phone Number :</Form.Label>
                <Form.Control
                  name="phone"
                  type="tel"
                  value={this.state.phone}
                  onChange={this.handleChange}
                  placeholder="Phone Number"
                  className={classnames("", {
                    invalid: errors.phone,
                  })}
                />
                <span style={{ color: "red" }}>{errors.phone}</span>
              </Form.Group>

              <Form.Label>Email :</Form.Label>
              <Form.Control
                name="email"
                type="email"
                value={this.state.email}
                onChange={this.handleChange}
                placeholder="Enter email"
                className={classnames("", {
                  invalid: errors.email,
                })}
                required
              />

              <span style={{ color: "red" }}>{errors.email}</span>
              <Form.Row>
                <Form.Group as={Col} controlId="formGridPassword">
                  <Form.Label>Password :</Form.Label>
                  <Form.Control
                    name="password"
                    type="password"
                    value={this.state.password}
                    onChange={this.handleChange}
                    placeholder="Password"
                    className={classnames("", {
                      invalid: errors.password,
                    })}
                    required
                  />
                </Form.Group>

                <Form.Group as={Col} controlId="formGridConfirmPassword">
                  <Form.Label>Confirm Password :</Form.Label>
                  <Form.Control
                    name="password2"
                    type="password"
                    value={this.state.password2}
                    onChange={this.handleChange}
                    placeholder="Confirm Password"
                    className={classnames("", {
                      invalid: errors.password2,
                    })}
                    required
                  />
                </Form.Group>
              </Form.Row>
              <span style={{ color: "red" }}>{errors.password}</span>
              <br />
              <span style={{ color: "red" }}>{errors.password2}</span>
              <br />
              <Button variant="primary" type="submit" className="mt-3">
                Save Changes
              </Button>
            </Form>
          </Col>
        </Row>
      </div>
    );
  }
}

// export default withRouter(Edit)

Edit.propTypes = {
  updateUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
};
const mapStateToProps = (state) => ({
  auth: state.auth,
  errors: state.errors,
});
export default withRouter(
  connect(mapStateToProps, { updateUser })(withRouter(Edit))
);

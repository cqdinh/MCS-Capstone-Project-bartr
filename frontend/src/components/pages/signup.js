import React from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Image from "react-bootstrap/Image";
import LandingNav from "../navigation/landingNav";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import ImageUploader from "react-images-upload";
import "../stylesheets/signup.css";
import { Link, withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { registerUser } from "../../actions/authActions";
import classnames from "classnames";
import Geocode from "react-geocode";

import API from "../../api";

class signup extends React.Component {
  constructor(props) {
    super(props);
    console.log("signup Props");
    console.log(props);
    this.state = {
      display_name: "",
      email: "",
      phone: "",
      password: "",
      password2: "",
      errors: {},
      coordinates: {
        // Default to coordinates at UCI
        latitude: 33.64597,
        longitude: -117.84282,
      },
      profilePicture: "",
    };
  }

  componentDidMount() {
    // If logged in and user navigates to Register page, should redirect them to dashboard
    if (this.props.auth.isAuthenticated) {
      this.props.history.push("/dashboard");
    }

    if (navigator.geolocation) {
      //console.log("Inside navigator");
      navigator.geolocation.getCurrentPosition((position) => {
        //console.log(position);
        // console.log("Here");
        // console.log(newCooords.latitude);
        // console.log(newCooords.longitude);
        this.setState({
          coordinates: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          },
        });
      });
    } else {
      console.log("Not supported");
    }
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

  onChange = (e) => {
    this.setState({ [e.target.id]: e.target.value });
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
    console.log(this.state.profilePicture);

    const newUser = {
      display_name: this.state.display_name,
      email: this.state.email,
      password: this.state.password,
      password2: this.state.password2,
      longitude: this.state.coordinates.longitude,
      latitude: this.state.coordinates.latitude,
      phone: this.state.phone,
      profilePicture: this.state.profilePicture,
    };
    console.log(newUser);
    this.props.registerUser(newUser, this.props.history);
    // Make Post request here

    // If success
    //alert("Sign Up Success");
    //document.getElementById("logo").click();
    // If Fail
    //alert("Sign Up unsuccessful. Try Again");
  };

  render() {
    const { errors } = this.state;
    return (
      <div>
        <LandingNav />
        <Row noGutters={true} className="signup-page">
          <Col xs={12} md={5} className="">
            <Row
              noGutters={true}
              className="d-flex justify-content-center mt-2"
            >
              <Image
                src={
                  "https://media.discordapp.net/attachments/714640587353227324/786424991671255061/Screen_Shot_2020-12-09_at_6.52.04_PM.png?width=569&height=565"
                }
                roundedCircle
                alt="Profile Photo"
                className="main-img"
                height="300px"
              />
            </Row>

            {/* <Row noGutters={true} className="d-flex justify-content-center mt-5">
                <Button>Upload Picture</Button>
            </Row> */}
          </Col>
          <Col xs={12} md={6} className="p-3 ml-5">
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
              <br />
              <Form.Label>Profile Picture :</Form.Label>
              <Form.Control
                name="profilePicture"
                type="text"
                value={this.state.profilePicture}
                onChange={this.handleChange}
                placeholder="Enter the link for your profile picture"
                className={classnames("", {
                  invalid: errors.profilePicture,
                })}
                required
              />
              <span style={{ color: "red" }}>{errors.profilePicture}</span>

              <Form.Row className="mt-3">
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

              <Button variant="primary" type="submit" className="">
                Register
              </Button>
            </Form>
          </Col>
        </Row>
      </div>
    );
  }
}

//export default signup;
signup.propTypes = {
  registerUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
};
const mapStateToProps = (state) => ({
  auth: state.auth,
  errors: state.errors,
});
export default withRouter(
  connect(mapStateToProps, { registerUser })(withRouter(signup))
);

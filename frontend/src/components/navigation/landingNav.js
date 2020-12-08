import React from "react";
import { Link, withRouter } from "react-router-dom";
import { QuestionCircle, PersonCircle } from "react-bootstrap-icons";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import "../stylesheets/landingNav.css";

import PropTypes from "prop-types";
import { connect } from "react-redux";
import { loginUser } from "../../actions/authActions";
import classnames from "classnames";

class LandingNav extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      show: false,
      email: "",
      password: "",
      errors: {},
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.auth.isAuthenticated) {
      this.props.history.push("/dashboard"); // push user to dashboard when they login
    }
    if (nextProps.errors) {
      this.setState({
        errors: nextProps.errors,
      });
    }
  }

  componentDidMount() {
    // If logged in and user navigates to Login page, should redirect them to dashboard
    if (this.props.auth.isAuthenticated) {
      this.props.history.push("/dashboard");
    }
  }

  handleClose = () => {
    this.setState({ show: false });
  };

  handleShow = () => {
    this.setState({ show: true });
  };

  handleChange = ({ target }) => {
    this.setState({ [target.name]: target.value });
  };

  onChange = (e) => {
    this.setState({ [e.target.id]: e.target.value });
  };

  handleSubmit = (event) => {
    event.preventDefault();
    console.log(this.state.email);
    console.log(this.state.password);

    const userData = {
      email: this.state.email,
      password: this.state.password,
    };
    this.props.loginUser(userData); // since we handle the redirect within our component, we don't need to pass in this.props.history as a parameter

    // Make API request for login and get userId

    // If correct Credentials
    //alert("Log In Success");
    //  this.props.history.push("/dashboard"); // Pass in userId prop
    // If incorrect credentials
    //alert("Incorrect Login Credentials");
  };

  render() {
    const { errors } = this.state;
    return (
      <>
        <Navbar expand="md" variant="dark" className="navigation-bar">
          <Navbar.Brand id="logo" href="/" className="navigation-bar-logo">
            <img
              src={window.location.origin + "/assets/logo2.png"}
              alt="Logo"
              height="75px"
            />
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="navbar-toggle" />
          <Navbar.Collapse id="navbar-toggle">
            <Nav className="ml-auto">
              <Nav.Item>
                <Nav.Link className="navtop-link">
                  <Link onClick={this.handleShow}>
                    <PersonCircle style={{ marginBottom: 5 }} size={32} /> Log
                    In / Sign Up
                  </Link>
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link className="navtop-link">
                  <Link to="/help">
                    <QuestionCircle style={{ marginBottom: 5 }} size={32} />{" "}
                    Help
                  </Link>
                </Nav.Link>
              </Nav.Item>
            </Nav>
          </Navbar.Collapse>
        </Navbar>

        <Modal
          show={this.state.show}
          onHide={this.handleClose}
          keyboard={false}
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title>Log In</Modal.Title>
          </Modal.Header>
          <Form noValidate onSubmit={this.handleSubmit}>
            <Modal.Body>
              <Form.Group controlId="formBasicEmail">
                <Form.Label>Email address :</Form.Label>
                <Form.Control
                  name="email"
                  type="email"
                  placeholder="Enter email"
                  value={this.state.email}
                  onChange={this.handleChange}
                  className={classnames("", {
                    invalid: errors.email || errors.emailnotfound,
                  })}
                  required
                />
                <span
                  style={{
                    color: "red",
                  }}
                >
                  {errors.email}
                  {errors.emailnotfound}
                </span>
              </Form.Group>

              <Form.Group controlId="formBasicPassword">
                <Form.Label>Password :</Form.Label>
                <Form.Control
                  name="password"
                  type="password"
                  placeholder="Password"
                  value={this.state.password}
                  onChange={this.handleChange}
                  className={classnames("", {
                    invalid: errors.password || errors.passwordincorrect,
                  })}
                  required
                />
                <span
                  style={{
                    color: "red",
                  }}
                >
                  {errors.password}
                  {errors.passwordincorrect}
                </span>
              </Form.Group>
            </Modal.Body>

            <Modal.Footer>
              <Button variant="success" type="submit">
                Log In
              </Button>
              <Button variant="primary">
                <Link to="/signup" className="link-button">
                  Sign Up
                </Link>
              </Button>
            </Modal.Footer>
          </Form>
        </Modal>
      </>
    );
  }
}

//export default withRouter(LandingNav);

LandingNav.propTypes = {
  loginUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
};
const mapStateToProps = (state) => ({
  auth: state.auth,
  errors: state.errors,
});
export default withRouter(connect(mapStateToProps, { loginUser })(LandingNav));

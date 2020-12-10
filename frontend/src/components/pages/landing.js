import React from 'react'
import { Link, withRouter } from "react-router-dom";
import Container from 'react-bootstrap/Container'
import LandingNav from '../navigation/landingNav'
import '../stylesheets/landing.css'
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import classnames from "classnames";
import { QuestionCircle, PersonCircle } from "react-bootstrap-icons";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { loginUser } from "../../actions/authActions";



class landing extends React.Component {
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
            <div className="landing-page">
            <Row style={{paddingTop: '10vh'}} noGutters={true}>   
                <Col md={6} style={{paddingTop: '25vh'}}>
                    
                    <Container className="landing-page-text">
                        <div className="text-desc">
                            
                            <h4><b>Bartr allows users to exchange the items they don't want with nearby people. 
                                Simply, take a picture and start trading.
                                Browse the items nearby. 
                                Propose a trade and finalize the deal!
                                </b>
                            </h4>
                        </div>
                        
                    </Container>
                </Col>       
                <Col md={1}>

                </Col>
                <Col md ={4} className="d-f justify-content-end ml-5">
                <img
                    src={window.location.origin + "/assets/logo2.png"}
                    alt="Logo"
                    className="logo-landing"
                    height="100px"
                />
                
                {/* <Link to="/help">
                    <QuestionCircle style={{ marginBottom: 5 }} size={32} />{" "}
                    Help
                </Link> */}
                <Form noValidate onSubmit={this.handleSubmit}>
                    <Form.Group controlId="formBasicEmail">
                        <Form.Label className="label-login">Email address :</Form.Label>
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
                        <Form.Label className="label-login">Password :</Form.Label>
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

                    <Button variant="success" type="submit">
                        Log In
                    </Button>

                    <Button variant="primary" className="ml-5">
                        <Link to="/signup" className="link-button">
                        Not a member? Register
                        </Link>
                    </Button>
                </Form>
                </Col> 
                
                
            </Row>
            
            </div>
        )
    }

    
}

// export default landing

landing.propTypes = {
    loginUser: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired,
  };
  const mapStateToProps = (state) => ({
    auth: state.auth,
    errors: state.errors,
  });
  export default withRouter(connect(mapStateToProps, { loginUser })(landing));

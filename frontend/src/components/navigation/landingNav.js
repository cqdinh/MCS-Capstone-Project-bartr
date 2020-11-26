import React from "react";
import {Link, withRouter} from 'react-router-dom'
import { QuestionCircle, PersonCircle } from 'react-bootstrap-icons';
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import '../stylesheets/landingNav.css'

class LandingNav extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            show: false,
            email: '',
            password: ''
        };
    };
    

    handleClose = () => {
        this.setState({show: false});
    }

    handleShow = () => {
        this.setState({show: true});
    };

    handleChange = ({target}) => {
        this.setState({ [target.name]: target.value });
    };

    handleSubmit = (event) => {
        event.preventDefault();
        console.log(this.state.email);
        console.log(this.state.password);

        // Make API request for login and get userId


        // If correct Credentials
        alert("Log In Success");
        this.props.history.push("/dashboard") // Pass in userId prop
        // If incorrect credentials
        alert("Incorrect Login Credentials")

    }

    render() {
        return ( 
            <>    
            <Navbar expand="md" variant="dark" className="navigation-bar">
                <Navbar.Brand id="logo" href="/" className="navigation-bar-logo">
                    <img src={window.location.origin + '/assets/logo2.png'} alt="Logo" height="75px"/>
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="navbar-toggle" />
                <Navbar.Collapse id="navbar-toggle">
                <Nav className="ml-auto">
                    <Nav.Item>
                        <Nav.Link className="navtop-link">
                            <Link onClick={this.handleShow}><PersonCircle style={{marginBottom:5}} size={32}/> Log In / Sign Up</Link>
                        </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link className="navtop-link">
                            <Link to="/help"><QuestionCircle style={{marginBottom:5}} size={32}/> Help</Link>
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
                <Form onSubmit={this.handleSubmit}>
                    <Modal.Body>
                        
                            <Form.Group controlId="formBasicEmail">
                                <Form.Label>Email address :</Form.Label>
                                <Form.Control name="email" type="email" placeholder="Enter email" value={this.state.email} onChange={this.handleChange} required/>
                                
                            </Form.Group>
        
                            <Form.Group controlId="formBasicPassword">
                                <Form.Label>Password :</Form.Label>
                                <Form.Control name="password" type="password" placeholder="Password" value={this.state.password} onChange={this.handleChange} required/>
                            </Form.Group>                                  
                        
                    </Modal.Body>
                
                    <Modal.Footer>                        
                        <Button variant="success" type="submit">Log In</Button>
                        <Button variant="primary"><Link to="/signup" style={{color: "white"}}>Sign Up</Link></Button>
                    </Modal.Footer> 
                </Form> 
            </Modal>
    
            </>
            
        )

    }
    
}

export default withRouter(LandingNav);
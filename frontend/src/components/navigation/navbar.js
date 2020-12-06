import React from "react";
import {Link, withRouter} from 'react-router-dom'
import { Shop, PersonCircle, BoxArrowRight } from 'react-bootstrap-icons';
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import Logo from '../assets/logo2.png'
import '../stylesheets/landingNav.css'
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { logoutUser } from "../../actions/authActions";

class navbar extends React.Component {
    constructor(props) {
        super(props);

    }
    
    onLogoutClick = (e) => {
        e.preventDefault();
        this.props.logoutUser();
        this.props.history.push("/");
    };

    render () {
        return (        
            <>    
            <Navbar expand="md" variant="dark" className="navigation-bar">
                <Navbar.Brand href="/dashboard" className="navigation-bar-logo">
                    <img src={Logo} alt="Logo" height="75px"/>
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="navbar-toggle" />
                <Navbar.Collapse id="navbar-toggle">
                <Nav className="ml-auto">
                    <Nav.Item>
                        <Nav.Link className="navtop-link">
                            <Link to="/dashboard"><PersonCircle style={{marginBottom:5}} size={32}/> My Profile</Link>
                        </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link className="navtop-link">
                            <Link to="/marketplace"><Shop style={{marginBottom:5}} size={32}/> MarketPlace</Link>
                        </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link className="navtop-link">
                            <Link onClick={this.onLogoutClick} to="/"><BoxArrowRight style={{marginBottom:5}} size={32}/> Logout</Link>
                        </Nav.Link>
                    </Nav.Item>
                </Nav>
                </Navbar.Collapse>
            </Navbar>
            </>            
        )
    }    
}

navbar.propTypes = {
    logoutUser: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
};
const mapStateToProps = (state) => ({
    auth: state.auth,
});
export default withRouter(connect(mapStateToProps, { logoutUser })(navbar));
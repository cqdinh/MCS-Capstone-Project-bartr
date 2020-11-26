import React from "react";
import {Link} from 'react-router-dom'
import { Shop, PersonCircle, BoxArrowRight } from 'react-bootstrap-icons';
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import Logo from '../assets/logo2.png'
import '../stylesheets/landingNav.css'

function navbar() {
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
                        <Link to="/"><BoxArrowRight style={{marginBottom:5}} size={32}/> Logout</Link>
                    </Nav.Link>
                </Nav.Item>
            </Nav>
            </Navbar.Collapse>
        </Navbar>
        </>
        
    )
}

export default navbar

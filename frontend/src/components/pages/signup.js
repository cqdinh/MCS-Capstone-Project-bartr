import React from 'react'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Image from 'react-bootstrap/Image'
import LandingNav from '../navigation/landingNav'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import ImageUploader from 'react-images-upload';
import '../stylesheets/signup.css'

class signup extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            pictures: [],
            img: '/assets/noimage.jpg',
            email: '',
            password: '',
            phone: '',
            name: '',
            address: '',
            city: '',
            state: 'California',
            zip: ''
        };
    };

    handleChange = ({target}) => {
        this.setState({ [target.name]: target.value });
    };

    onDrop = (picture) => {
        this.setState({
            pictures: this.state.pictures.concat(picture),
        });
    }

    handleSubmit = (event) => {
        event.preventDefault();
        console.log(this.state.email);
        console.log(this.state.password);
        console.log(this.state.name);
        console.log(this.state.state);
        console.log(this.state.address);
        
        // Make Post request here

        // If success
        alert("Sign Up Success");
        document.getElementById("logo").click();
        // If Fail
        alert("Sign Up unsuccessful. Try Again");
        
    }


    render() {
        return (
            <div>
                <LandingNav />
                <Row noGutters={true} className="signup-page">
                    <Col xs={12} md={5} className="">
                        <Row noGutters={true} className="d-flex justify-content-center mt-2">
                            <Image src= {window.location.origin + this.state.img} roundedCircle alt="Profile Photo" className="main-img" height="300px"/>
                        </Row> 
                        <ImageUploader
                            className="p-3"
                            withIcon={true}
                            buttonText='Choose images'
                            label='Max file size: 5mb, accepted: jpg, png'
                            onChange={this.onDrop}
                            imgExtension={['.jpg', '.png']}
                            maxFileSize={5242880}   
                            singleImage={true}                                    
                            withPreview={true}                        
                        />
                        {/* <Row noGutters={true} className="d-flex justify-content-center mt-5">
                            <Button>Upload Picture</Button>
                        </Row> */}
                    </Col>
                    <Col xs={12} md={7} className="p-3">
                        <Form onSubmit={this.handleSubmit}>
                            <Form.Group controlId="formGridName">
                                <Form.Label>Name :</Form.Label>
                                <Form.Control 
                                name="name" 
                                type="text" 
                                value={this.state.name}
                                onChange={this.handleChange} 
                                placeholder="Full Name" 
                                required
                                />
                            </Form.Group>
    
                            <Form.Group controlId="formGridPhone">
                                <Form.Label>Phone Number :</Form.Label>
                                <Form.Control 
                                name="phone" 
                                type="tel" 
                                value={this.state.phone}
                                onChange={this.handleChange} 
                                placeholder="Phone Number"/>
                            </Form.Group>
    
                            <Form.Row>
                                <Form.Group as={Col} controlId="formGridEmail">
                                <Form.Label>Email :</Form.Label>
                                <Form.Control 
                                name="email" 
                                type="email" 
                                value={this.state.email}
                                onChange={this.handleChange} 
                                placeholder="Enter email" 
                                required/>
                                </Form.Group>
    
                                <Form.Group as={Col} controlId="formGridPassword">
                                <Form.Label>Password :</Form.Label>
                                <Form.Control 
                                name="password" 
                                type="password" 
                                value={this.state.password}
                                onChange={this.handleChange} 
                                placeholder="Password" 
                                required/>
                                </Form.Group>
                            </Form.Row>
    
                            <Form.Group controlId="formGridAddress1">
                                <Form.Label>Address :</Form.Label>
                                <Form.Control 
                                name="address" 
                                type="text" 
                                value={this.state.address}
                                onChange={this.handleChange} 
                                placeholder="1234 Main St" 
                                required
                                />
                            </Form.Group>
    
                            
    
                            <Form.Row>
                                <Form.Group as={Col} controlId="formGridCity">
                                <Form.Label>City :</Form.Label>
                                <Form.Control 
                                name="city" 
                                type="text" 
                                value={this.state.city}
                                onChange={this.handleChange} 
                                placeholder="Irvine"
                                required
                                />
                                </Form.Group>
    
                                <Form.Group as={Col} controlId="formGridState">
                                <Form.Label>State :</Form.Label>
                                <Form.Control as="select" value={this.state.state} 
                                name="state"
                                onChange={this.handleChange} 
                                >            
                                    <option>California</option>
                                </Form.Control>
                                </Form.Group>
    
                                <Form.Group as={Col} controlId="formGridZip">
                                <Form.Label>Zip :</Form.Label>
                                <Form.Control 
                                name="zip" 
                                type="number" 
                                value={this.state.zip}
                                onChange={this.handleChange} 
                                placeholder="92612"
                                required
                                />
                                </Form.Group>
                            </Form.Row>
    
                            
    
                            <Button variant="primary" type="submit" className="mt-3">Sign Up</Button>
                        </Form>
                    </Col>
                </Row>
            </div>
        )
    }
    
}

export default signup

import React, { Component } from 'react'
import {withRouter} from 'react-router-dom'
import NavBar from '../navigation/navbar'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Image from 'react-bootstrap/Image'
import Button from 'react-bootstrap/Button'
import Container from 'react-bootstrap/Container'
import Form from 'react-bootstrap/Form'
import ImageUploader from 'react-images-upload';

export class AddItem extends Component {
    constructor(props) {
        super(props);
        this.state = {
            productName: '',
            productDesc: '',
            pictures: [],
            name: "Parth Shah",
            address: "3801 Parkview Lane, Irvine, CA - 12312",
            phoneNo: "21232435665",
            email: "parth@gmail.com"
            
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
        console.log(this.state.productName);
        console.log(this.state.productDesc);
        // API Request to add item to user collection and redirect to dashboard
        console.log(this.state.pictures);
        alert("Item Added Successfully");
        this.props.history.push("/dashboard") // Pass in userId prop
        
    }

    render() {
        return (
            <div>
                <NavBar />
                <Row noGutters={true}>
                    <Col xs={12} md={5} className="dashboard-profile">
                        <Row noGutters={true} className="d-flex justify-content-center">
                            <Image src= {window.location.origin + '/assets/noimage.jpg'} roundedCircle alt="Profile Photo" className="profile-img"/>
                        </Row> 
                        <Row noGutters={true} className="d-flex justify-content-center user-name">
                            <h3>{this.state.name}</h3>                        
                        </Row>
                        <Container>
                            <Row noGutters={true} className="user-details">
                                <h6><b>Address:</b> {this.state.address}</h6>
                            </Row>
                            <Row noGutters={true} className="user-details">
                                <h6><b>Phone No:</b> {this.state.phoneNo}</h6>
                            </Row>
                            <Row noGutters={true} className="user-details">
                                <h6><b>Email:</b> {this.state.email}</h6>
                            </Row>
                        </Container>
                        <Button variant="primary" type="submit" className="m-3 pl-3 pr-3">
                            {/* Non Functional for now */}
                            Edit
                        </Button>
                    </Col>
                    <Col xs={12} md={7} className="user-collections">  
                        <h3>Add new Item</h3>
                        <Form onSubmit={this.handleSubmit} className="p-3">
                            <Form.Group controlId="formGridName">
                                <Form.Label>Product Name :</Form.Label>
                                <Form.Control 
                                name="productName" 
                                type="text" 
                                value={this.state.productName}
                                onChange={this.handleChange} 
                                placeholder="Product Name" 
                                required
                                />
                            </Form.Group> 

                            <Form.Group controlId="formGridDesc">
                                <Form.Label>Product Description :</Form.Label>
                                <Form.Control 
                                name="productDesc" 
                                as="textarea" 
                                rows={3}
                                value={this.state.productDesc}
                                onChange={this.handleChange} 
                                placeholder="Product Description" 
                                required
                                />
                            </Form.Group>    

                            <ImageUploader
                                withIcon={true}
                                buttonText='Choose images'
                                label='Max file size: 5mb, accepted: jpg, png'
                                onChange={this.onDrop}
                                imgExtension={['.jpg', '.png']}
                                maxFileSize={5242880}                                       
                                withPreview={true}                        
                            />                     
    
                            <Button variant="primary" type="submit">Add Item</Button>
                        </Form>
                        
                    </Col>
                </Row>
            </div>
        )
    }
}

export default withRouter(AddItem)

import React, { Component } from 'react'
import {withRouter} from 'react-router-dom'
import NavBar from '../navigation/navbar'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Image from 'react-bootstrap/Image'
import Button from 'react-bootstrap/Button'
import Container from 'react-bootstrap/Container'
import Form from 'react-bootstrap/Form'
import PropTypes from "prop-types";
import { connect } from "react-redux";

import API from '../../api'

function createItem(name, value, user_id, description, image_link){
    return API.post('items/add', {
        name: name,
        value: value,
        user_id: user_id,
        description: description,
        image_link: image_link
    });
}

export class AddItem extends Component {
    constructor(props) {
        super(props);
        this.state = {
            productName: '',
            productDesc: '',
            imageLink: '',
            name: "",
            phoneNo: "",
            email: ""
            
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

        console.log(this.props)

        const userId = this.props.auth.user.id;
        createItem(this.state.productName, 0.0, userId, this.state.productDesc, this.state.imageLink).then(
            success => alert("Item Added Successfully")
        )

        this.props.history.push("/dashboard")
    }

    render() {
        const user = this.props.auth.user;
        console.log(user)
        return (
            <div>
                <NavBar />
                
                <Row noGutters={true} style={{height: '90vh'}}>
                    <Col xs={12} md={5} className="dashboard-profile">
                        <Row noGutters={true} className="d-flex justify-content-center">
                            <Image src= {'https://media.discordapp.net/attachments/714640587353227324/786424991671255061/Screen_Shot_2020-12-09_at_6.52.04_PM.png?width=569&height=565'}
                            roundedCircle alt="Profile Photo" className="profile-img"/>
                        </Row> 
                        <Row noGutters={true} className="d-flex justify-content-center user-name">
                            <h3>{user.display_name}</h3>                        
                        </Row>
                        <Container>
                            
                            <Row noGutters={true} className="user-details">
                                <h6><b>Phone No: {user.phone} </b></h6>
                            </Row>
                            <Row noGutters={true} className="user-details">
                                <h6><b>Email: {user.email} </b></h6>
                            </Row>
                        </Container>
                        
                    </Col>
                    
                    <Col xs={12} md={7} className="user-collections">  
                        <h3>Add new Item</h3>
                        <Form onSubmit={this.handleSubmit} className="p-3">
                            <Form.Group controlId="formGridName">
                                <Form.Label className="label-modal">Product Name :</Form.Label>
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
                                <Form.Label className="label-modal">Product Description :</Form.Label>
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

                            <Form.Group controlId="formGridDesc">
                                <Form.Label className="label-modal">Image Link:</Form.Label>
                                <Form.Control 
                                name="imageLink" 
                                as="textarea" 
                                rows={1}
                                value={this.state.imageLink}
                                onChange={this.handleChange} 
                                placeholder="Link to Image" 
                                required
                                />
                            </Form.Group>  
                
    
                            <Button variant="primary" type="submit">Add Item</Button>
                        </Form>
                        
                    </Col>
                </Row>
            </div>
        )
    }
}

AddItem.propTypes = {
    auth: PropTypes.object.isRequired,
  };
  const mapStateToProps = (state) => ({
    auth: state.auth,
  });
  export default connect(mapStateToProps, {})(AddItem);
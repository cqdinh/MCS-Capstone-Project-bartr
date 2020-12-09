import React, { Component } from 'react'
import Image from 'react-bootstrap/Image'
import Row from 'react-bootstrap/Row'


export class ImageContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
                       
        };
    }
    render() {
        return (
            <Row noGutters={true} className="ml-3 justify-content-center">
                {this.props.images.map((img, index) =>
                    <Image src={img} rounded alt={"Product Image " + index} height="100px" className="m-2"/>
                )}
                                        
            </Row>
        )
    }
}

export default ImageContainer

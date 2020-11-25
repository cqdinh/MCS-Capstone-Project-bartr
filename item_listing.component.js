import React, { Component } from 'react';

import API from 'api';

class ItemListingCreation extends Component {
    constructor(props) {
        super(props);


    }

    async componentDidMount(){
        const item_doc = await API.post('items/get_one', {
            id: this.props.item_id
        });
        
        const user_name = await API.post('users/name', {
            id: item_doc.user_id
        });

        item_doc.user_name = user_name

        this.setState({data: item_doc})
    }

    render() {
        const item_id = this.props.item_id;

        return (
            <div>
                Name: {this.state.data.name}
                <br/>
                Value: ${this.state.data.value}
                User: {this.state.data.user_name}
                Status: {this.state.data.status}
            </div>
        )
    }
}
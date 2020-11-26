import React from 'react'
import Container from 'react-bootstrap/Container'
import LandingNav from '../navigation/landingNav'

function Help() {
    return (
        <div className="help-page">
            <LandingNav />
            <Container className="landing-page-text">
                <div className="text-desc">
                    <h3>Description :</h3>
                    <p>A web application that allows users to exchange the items they don't want with other users. 
                        Users will post items which other users propose trades for. 
                        Those trades can be accepted, rejected, or modified to create a counter-offer. 
                        To facilitate the actual trades, they must be between users whose locations are within some defined distance of each other.
                    </p>
                </div>
                <div className="text-hiw">
                    <h3>How it Works ?</h3>
                    <p><b>1.</b> Find an item you are interested in</p>
                    <p><b>2.</b> Once you find a product of interest intiate a trade offer with one or more of your items</p>
                    <p><b>3.</b> Negiotiate a mutually acceptable deal</p>
                    <p><b>4.</b> Finalize the deal to recieve contact information of the product owner</p>
                </div>
            </Container>
        </div>
    )
}

export default Help

import React from 'react'
import Jumbotron from 'react-bootstrap/Jumbotron'
import LandingNav from '../navigation/landingNav'

function Error() {
    return (
        <div>
            <LandingNav />
            <Jumbotron>            
                <h3>Error: The page does not exist</h3>            
            </Jumbotron>
        </div>
        
    )
}

export default Error

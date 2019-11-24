import React from 'react';

export default class Home extends React.Component {

    render () {
        return (
            <div className="general-page-layout">
                <h1>hello</h1>
                <p>This is my playground for games and animations.</p>
                <p>I'd warn that it was still under construction, but that seems silly because it will never not be under construction.  It is a playground, being under construction is what it is for.</p>
                <p>Enjoy! 
                    <span role="img" aria-label="emoji">&#129303;</span> 
                    <span role="img" aria-label="emoji">&#128540;</span> 
                    <span role="img" aria-label="emoji">&#129322;</span>
                 </p>
            </div>
        )
    }
}
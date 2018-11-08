import React from 'react';
import './About.css';
import AboutStar from '../svgs/AboutStar.svg';

export default function About () {
    return (
		<section className="aboutPage">
			
		    <div className="starsCont">
				<div className="starCont">
					<img src={AboutStar} alt="s1" className="star1 counterClockwise"/>
				</div>
				<div className="starCont">
					<img src={AboutStar}  alt="s2" className="star2 clockwise"/>
				</div>
				<div className="starCont">
					<img src={AboutStar}  alt="s3" className="star3 counterClockwise2"/>
				</div>
				<div className="starCont">
					<img src={AboutStar}  alt="s4" className="star4 clockwise2"/>
				</div>
			</div>
			<div className="aboutPageText">
				<h2>About</h2>
				 <p>My goal here is to create an art based interactive experience that makes people feel peaceful and refreshed.</p>
				{/*
				 <p>Several goals I have: 
				 <ul>
				 <li>user must make account</li>
				 <li>each users world will be a customizable work of art</li>
				 <li>users can visit each other&apos;s world and add art to their background</li>
				 <li>I would like the user to have to return at least once a week.  Not with an incentive that involves punishment, but reward.</li>
				 <li>I would like there to be a way for to know generally where the users are</li>
				 </ul>
				 </p>
				 */}
			</div>
		</section>
    );
}

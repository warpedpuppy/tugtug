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
				 <p>We web devs spend a lot of time materializing other people's vistions. </p>

	            <p>This site is going to be my site to do with as I please.</p>
			</div>
		</section>
    );
}

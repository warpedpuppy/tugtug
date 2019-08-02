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
				<p>about:</p>
				 <p>I don&apos;t fucking know.</p>
				 <p>Fuck, I should probably know what this site is about, shouldn&apos;t I?</p>
				 <p>I don&apos;t.   I don&apos;t fucking know</p>
			</div>
		</section>
    );
}

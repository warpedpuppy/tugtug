import React from 'react';
export default function Register (props) {
	return (
		<form style={props.styleProp}>
			<h4>Register</h4>
			<input type="email" placeholder="email" required />
			<input type="password" placeholder="password" required />
			<div>
			<input type="submit" value="register" />
			</div>
		</form>
	)
}
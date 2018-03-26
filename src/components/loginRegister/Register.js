import React from 'react';
export default function Register (props) {
	return (
		<form style={props.styleProp}>
			<h4>Register</h4>
			<input type="text" placeholder="email" />
			<input type="password" placeholder="password" />
			<div>
			<input type="submit" value="register" />
			</div>
		</form>
	)
}
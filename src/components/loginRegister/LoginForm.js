import React from 'react';
export default function LoginForm (props) {
	return (
		<form style={props.styleProp}>
			<h4>Log In</h4>
			<input type="text" placeholder="email" />
			<input type="password" placeholder="password" />
			<div>
				<input type="submit" value="log in" />
			</div>
		</form>

		)
}
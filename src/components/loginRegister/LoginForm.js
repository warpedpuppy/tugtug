import React from 'react';
export default function LoginForm (props) {
	return (
		<form style={props.styleProp}>
			<h4>Log In</h4>
			<input type="email" placeholder="email" required />
			<input type="password" placeholder="password" required />
			<div>
				<input type="submit" value="log in" />
			</div>
		</form>

		)
}
import { useState, ChangeEvent } from 'react';
import Router from 'next/router';

import { RequestMethods, useRequest } from '../../hooks';

export default () => {

	const firstName = 'Bo';
	const lastName = 'Slott';
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const { doRequest, errors } = useRequest({
		url: '/api/users/signup',
		method: RequestMethods.POST,
		body: {
			firstName,
			lastName,
			email,
			password,
		},
		onSuccess: () => Router.push('/'),
	});

	const onSubmit = async (e: ChangeEvent<EventTarget>) => {
		e.preventDefault();
		await doRequest();
	};

	return (
		<form onSubmit={onSubmit}>
			<h1>Signup</h1>
			<div className="form-group">
				<label htmlFor="email">Email Address</label>
				<input
					name="email"
					type="email"
					className="form-control"
					value={email}
					onChange={e => setEmail(e.target.value)}
				/>
			</div>
			<div className="form-group">
				<label htmlFor="password">Password</label>
				<input
					name="password"
					type="password"
					className="form-control"
					value={password}
					onChange={e => setPassword(e.target.value)}
				/>
			</div>
			{errors}
			<button className="btn btn-primary">Sign Up</button>
		</form>
	)
};

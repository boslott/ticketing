import { useEffect } from 'react';
import Router from 'next/router';
import { useRequest, RequestMethods } from '../../hooks';

export default () => {
	const { doRequest } = useRequest({
		url: '/api/users/signout',
		method: RequestMethods.POST,
		body: {},
		onSuccess: () => Router.push('/')
	});

	useEffect(() => {
		doRequest();
	}, []);

	return <div>Signing you out...</div>;
};

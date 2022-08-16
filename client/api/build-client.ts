import axios from 'axios';

export default ({ req }) => {
	if (typeof window === 'undefined') {
		// We are on the SERVER
		console.log('Making a call from SERVER-SIDE service to SERVER-SIDE service for currentuser')

		return axios.create({
			baseURL: 'http://ingress-nginx-controller.ingress-nginx',
			headers: req.headers
		});
	} else {
		// We are on the BROWSER
		console.log('The BROWSER is making the currentuser call');

		return axios.create({
			baseURL: '/',
		});
	}
};


import { buildAxiosClient } from '../api';



const LandingPage = ({ currentUser }) => {
	// console.log('currentUser from the BROWSER: ', currentUser);

	return <h1>{currentUser ? 'You are signed in' : 'You are NOT signed in'}</h1>
};

// The context parameter has the request property on it
LandingPage.getInitialProps = async (context) => {
	// console.log('req.headers: ', req.headers);
	const axiosClient = buildAxiosClient(context);
	const { data } = await axiosClient.get('/api/users/currentuser');
	console.log({ data });
	return data;
};


export default LandingPage;

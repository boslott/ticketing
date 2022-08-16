import type { AppProps } from 'next/app';
import 'bootstrap/dist/css/bootstrap.css';

import { buildAxiosClient } from '../api';
import { Header } from '../components';

const AppComponent = ({ Component, pageProps }: AppProps) => {
	const { currentUser } = pageProps;
	return (
		<div className="container">
			<Header currentUser={currentUser} />
			<Component {...pageProps} />
		</div>
	)
}

AppComponent.getInitialProps = async (appContext) => {
	// console.log(Object.keys(appContext.ctx.req));
	// return {};
	const axiosClient = buildAxiosClient(appContext.ctx);
	const { data } = await axiosClient.get('/api/users/currentuser');

	// To call getInitialProps on an inidivial component, we call it here in the AppComponent
	// The component receives the object pageProps
	// If a component does not need initialProps, it will not call it, so it will not be defined
	let pageProps = {};
	if (appContext.Component.getInitialProps) {
		pageProps = await appContext.Component.getInitialProps(appContext.ctx);
	}

	return {
		pageProps,
		...data,
	};
};

export default AppComponent;

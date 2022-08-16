import axios from 'axios';
import { useState } from 'react';

export enum RequestMethods {
	GET = "get",
	POST = "post",
	PATCH = "patch",
	PUT = "put",
	DELETE = "delete",
}

interface RequestProps {
	url: string;
	method: RequestMethods;
	body: object;
	onSuccess?: Function;
}

interface ErrorMessage {
	message: string;
	field?: string
}

export default ({ url, method, body, onSuccess }: RequestProps) => {
	// method must === 'get', 'post', 'patch', 'put', or 'delete'
	const [errors, setErrors] = useState(null);

	const doRequest = async () => {
		try {
			setErrors(null);
			const response = await axios[method](url, body);

			// If onSuccess is provided, call it and send it the data
			if (onSuccess) {
				onSuccess(response.data);
			}

			return response.data;
		} catch (err) {
			setErrors(
				<div className="alert-danger alert">
					<h4>Ooops ....</h4>
					<ul className="my-0">
						{err.response.data.errors.map((err: ErrorMessage) => (
							<li key={err.message}>{err.message}</li>
						))}
					</ul>
				</div>
			);
		}
	};

	return { doRequest, errors };
};

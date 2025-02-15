import { UseFormSetError } from "react-hook-form";

interface Errors {
	[key: string]: string;
}

function handleFormValidationErrors(errors: Errors[], setError: UseFormSetError<any>) {
	errors.forEach((err) => {
		Object.keys(err).forEach((key) => {
			setError(key, { message: err[key] });
		});
	});
}

export default handleFormValidationErrors;

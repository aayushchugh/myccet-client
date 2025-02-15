import axios from "axios";
import { toast } from "sonner";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

const apiService = axios.create({
	baseURL: BASE_URL,
	headers: {
		"Content-Type": "application/json",
	},
});

apiService.interceptors.response.use(
	(res) => Promise.resolve(res),
	(err) => {
		const status = err.response?.status;

		if (status === 500) {
			toast.error("An error occurred. Please try again later.");
		}

		return Promise.reject(err);
	},
);

export default apiService;

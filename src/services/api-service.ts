import axios from "axios";
import { toast } from "sonner";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

if (!BASE_URL) {
	console.error("NEXT_PUBLIC_API_URL is not defined");
}

const apiService = axios.create({
	baseURL: BASE_URL,
	headers: {
		"Content-Type": "application/json",
	},
});

// Add request interceptor to add token to each request
apiService.interceptors.request.use(
	(config) => {
		const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
		if (token) {
			config.headers.Authorization = `Bearer ${token}`;
		}
		return config;
	},
	(error) => {
		return Promise.reject(error);
	},
);

apiService.interceptors.response.use(
	(res) => Promise.resolve(res),
	(err) => {
		const status = err.response?.status;

		if (status === 500) {
			toast.error("An error occurred. Please try again later.");
		}

		// Handle network errors
		if (!err.response) {
			toast.error("Network error. Please check your connection.");
		}

		return Promise.reject(err);
	},
);

export default apiService;

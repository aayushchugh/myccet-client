import axios from "axios";
import { toast } from "sonner";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;
const accessToken = localStorage.getItem("token");

const apiService = axios.create({
	baseURL: BASE_URL,
	headers: {
		"Content-Type": "application/json",
		// If there is accessToken, add it to the header
		...(accessToken && { Authorization: `Bearer ${accessToken}` }),
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

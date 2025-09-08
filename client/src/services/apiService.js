import axios from "axios";

const apiService = axios.create({

  // This means that for any request made with this instance,
  // 'http://localhost:5000/api' will be prepended to the URL.
  // For example, apiService.get('/posts') will make a GET request to 'http://localhost:5000/api/posts'.
  baseURL: "http://localhost:5000/api",
});

// This function will be called for EVERY request made using this 'apiService' instance.
apiService.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");

        if(token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);


export default apiService;
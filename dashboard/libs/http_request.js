import axios from 'axios'

const instance = axios.create({
    baseURL: process.env.API_PATH,
    timeout: 12000,
})

instance.defaults.headers.common['Content-Type'] = 'application/json'

// axios.interceptors.request.use(function (config) {
//   // Do something before request is sent
//   return config;
// }, function (error) {
//   // Do something with request error
//   return Promise.reject(error);
// });

instance.interceptors.response.use(
    function (response) {
        // Any status code that lie within the range of 2xx cause this function to trigger
        // Do something with response data
        // console.log(response.data)
        return response
    },
    function (error) {
        // Any status codes that falls outside the range of 2xx cause this function to trigger
        // Do something with response error
        return Promise.reject(error)
    }
)

export default instance

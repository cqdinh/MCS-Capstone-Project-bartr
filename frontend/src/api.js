import axios from 'axios';

// Create a wrapper around axios so we don't have to type
// {params: <parameter object>}
// for every api call
const AxiosAPI = {
    baseURL: 'http://localhost:5000/api/',

    get: function(url, params){
        return axios.get(this.baseURL + url, {params: params})
    },

    post: function(url, params){
        return axios.post(this.baseURL + url, params)
    }
}

export default AxiosAPI